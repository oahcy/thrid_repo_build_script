const shell = require("shelljs");
const util = require('util');
//const JSON = require('JSON');
const fs = require('fs');
const path = require('path')
var process = require("process");

//config
const cmake_shared_libs = ""//"-DBUILD_SHARED_LIBS=ON -DBUILD_STATIC_LIBS=OFF -DBUILD_TESTS=OFF";
const configure_shared_libs = "";

function RunCommand(cmd, ...cmds) {
  const command = util.format(cmd, ...cmds);
  const child_process = require('child_process');
  console.log(command);
  try {
    const ret = child_process.execSync(command, { "env": user_envs.GetEvns() });
    //console.log(ret.toString());
    return ret;
  }catch (e) {
    console.log("err!!!");
  }
  return null;
}

function MakeDir(path) {
  if (!fs.existsSync(path)) fs.mkdirSync(path,{recursive: true});
  command_recorder.AddCommand("mkdir %s", path);
}

function ReplaceScriptTmp(from_lists, to_lists) {
  const replace = require('replace-in-file');
  const options = {
    files: 'script/*',
    from: from_lists,
    to: to_lists,
    countMatches: true,
  };
  try {
    const result = replace.sync(options);
    console.log(result);
  } catch(err) {
    console.log('error:', err);
  }
}

function CommandRecord() {
  this.commands = [];
  this.AddCommand = (cmd, ...cmds) => {
  const command = util.format(cmd, ...cmds);
    this.commands.push(command);
    return this;
  }
  this.AddCdCmd = (path) => {
    const cmd = "cd " + path;
    this.commands.push(cmd);
    return this;
  }
  this.AddEnvCmd = (env_map) => {
    for (var index in env_map) {
      const cmd = util.format("set %s=%s", index, env_map[index]);
      this.commands.push(cmd);
    }
    return this;
  }
  this.SaveCmd = (file_name) => {
    fs.writeFileSync(file_name, this.commands.join('\n'));
    return this;
  }
  this.AddNote = (note) => {
    this.commands.push(util.format("echo %s", note));
    return this;
  }
  this.PassBy = () => {
    return true;
  }
  this.PassDownLoad = () => {
    return true;
  }
}

function Env(){
  this.envs = {};
  this.AddEnv = (env_map) => {
    for (var index in env_map) {
      this.envs[index] = env_map[index];
    }
  }
  this.RemoveEnv = (key) => {
    if (this.envs.key) {
      delete this.envs.key;
    }
  }
  this.GetEvns = () => {
    var current_envs = require("process").env;
    for (var index in this.envs) {
      current_envs[index] = this.envs[index];
    }
    return current_envs;
  }
}

function PathOpt() {
  this.store_paths = [];
  this.current_path = "";
  this.Push = (dst_path) => {
    var current_path = process.cwd();
    if (fs.existsSync(dst_path)) {
      process.chdir(dst_path);
      command_recorder.AddCdCmd(dst_path);
      console.log("enter:" + dst_path);
      this.current_path = dst_path;
      this.store_paths.push(current_path);
    }
  },
  this.Pop = () => {
    if (this.store_paths.length > 0) {
      const p = this.store_paths.pop();
      console.log("leave:" + this.current_path);
      console.log("current:" + p);
      process.chdir(p);
      command_recorder.AddCdCmd(p);
    }
  }
};

var path_opt = new PathOpt();
var user_envs = new Env();
var command_recorder = new CommandRecord();

console.log(shell.exec('git --version'));

function RunTask() {
  //1,get code
  //2,compile code
  //3,collect result

}

function UnExtWithSuitableFormat(file, out_dir) {
  MakeDir(out_dir)
  const ext_name = path.extname(file).toLowerCase();
  if (ext_name == ".zip") {
    RunCommand("unzip -o %s -d %s", file, out_dir);
  } else if (ext_name == ".gz") {
    RunCommand("tar  -zxvf  %s  -C %s", file, out_dir);
  } else if (ext_name == ".bz2") {
    RunCommand("tar  -jxvf  %s  -C %s", file, out_dir);
  }
}

function BuildByCOnfigure(bld_path, configure_path, config) {
  path_opt.Push(bld_path);
  if (!command_recorder.AddCommand("%s --prefix=%s %s", configure_path, config.output_path, configure_shared_libs).PassBy()) {
    RunCommand("%s --prefix=%s %s", configure_path, config.output_path, configure_shared_libs);
  }

  if (config.after_build) {
    path_opt.Push(bld_path);
    const shell_path = path.join(config.work_path, config.after_build);
    RunCommand(shell_path);
    path_opt.Pop();
  }
  if (!command_recorder.AddCommand("make").PassBy()) {
    RunCommand("make");
  }
  if (!command_recorder.AddCommand("make install").PassBy()) {
    RunCommand("make install");
  }
  path_opt.Pop();
}

function Build(bld_path, config) {
  //
  if (config.before_compile) {
    path_opt.Push(config.repe_path);
    const shell_path = path.join(config.work_path, config.before_compile);
    RunCommand(shell_path);
    path_opt.Pop();
  }
  if (config.env_set) {
    const env_path = path.join(config.work_path, config.env_set);
    const env_path_str = fs.readFileSync(env_path).toString();
    const env_obj = JSON.parse(env_path_str);
    user_envs.AddEnv(env_obj);
    command_recorder.AddEnvCmd(env_obj);
  }
  //
  const dst_bld_path = bld_path;
  MakeDir(dst_bld_path);
  if (config.build_type == "configure") {
    if (config.use_clang) {
      user_envs.AddEnv({"CC": "/usr/bin/clang"});
    }
    BuildByCOnfigure(dst_bld_path, path.join(config.repe_path, "configure"), config);
    user_envs.RemoveEnv("CC");
  }else if (config.build_type == "cmake") {
    var cmake_params = "";
    if (config.cmake_params_file) {
      const cmake_params_file_path = path.join(config.work_path, config.cmake_params_file);
      cmake_params = fs.readFileSync(cmake_params_file_path).toString();
    }
    if (config.use_clang) {
      cmake_params = cmake_params + " -DCMAKE_C_COMPILER=/usr/bin/clang -DCMAKE_CXX_COMPILER=/usr/bin/clang++ "
    }
    var cmd = util.format("cmake -DCMAKE_VERBOSE_MAKEFILE:BOOL=ON -S%s -B%s -DCMAKE_INSTALL_PREFIX:PATH=%s %s %s", config.repe_path, dst_bld_path, config.output_path,cmake_shared_libs, cmake_params);
    if (!command_recorder.AddCommand(cmd).PassBy()) {
      RunCommand(cmd);
    }
    path_opt.Push(dst_bld_path);
    cmd = "make";
    if (!command_recorder.AddCommand(cmd).PassBy()) {
      RunCommand(cmd);
    }
    cmd = "make install";
    if (!command_recorder.AddCommand(cmd).PassBy()) {
      RunCommand(cmd);
    }
    path_opt.Pop();
  }
}

function RunByConfig(file_path) {
  const work_path = process.cwd();
  //1,laod config
  const custom_config_str = fs.readFileSync(file_path).toString();
  const config_obj = JSON.parse(custom_config_str);

  //2, get dst path
  const dst_path = config_obj.dst_path;
  const downlaod_dst_path = path.join(dst_path, "downlaod");
  const bld_dst_path = path.join(dst_path, "bld");
  const output_path = path.join(dst_path, "output");

  user_envs.AddEnv({"THIRD_PART_OUTPUT_DIR" : output_path});

  //replace script tmp
  ReplaceScriptTmp([/\{OUTPUT_PATH\}/g], output_path);

  MakeDir(dst_path);
  MakeDir(downlaod_dst_path);
  MakeDir(output_path);

  path_opt.Push(dst_path);

  config_obj.packages.forEach((v) => {
    console.log(v);
    command_recorder.AddNote(v.name + " start ...");
    v.output_path = path.join(output_path, v.name);
    v.work_path = work_path;
    v.bld_path = path.join(bld_dst_path, v.name);
    if (v.use_clang == undefined) {
      v.use_clang = config_obj.use_clang;
    }

    if (fs.existsSync(v.output_path) && !command_recorder.PassBy()) {
      console.log(util.format("pass : %s, you can delete this dir for recompile.", v.output_path));
      return;
    }
    if (v.type == "git") {
      if (v.path) {
        //get code
          v.repe_path = path.join(dst_path, v.name);
          if (!command_recorder.PassDownLoad()) {
          RunCommand('git clone %s', v.path);
          RunCommand("git -C %s reset --hard %s", v.repe_path, v.commit_id);
        }
        //compile
        Build(v.bld_path, v);
        //cpy dst file
      }
    } else if (v.type == "url") {
      const ext_path = path.join(dst_path, v.name);
      const file_name = v.path.substring(v.path.lastIndexOf('/') + 1);
      const local_path = path.join(downlaod_dst_path, file_name);
      if (!command_recorder.PassDownLoad()) {
          if (!fs.existsSync(local_path)) {
            path_opt.Push(downlaod_dst_path);
            RunCommand("wget %s", v.path);
            path_opt.Pop();
          }
          UnExtWithSuitableFormat(local_path, ext_path);
        }
        v.repe_path = path.join(ext_path, v.subdir);

        Build(v.bld_path, v);
    }
    command_recorder.AddNote(v.name + " stop");
  });
  command_recorder.SaveCmd("cmd.sh");
}

RunByConfig("custom_config.json");