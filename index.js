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
    }
  }
};

var path_opt = new PathOpt();
var user_envs = new Env();

console.log(shell.exec('git --version'));

function RunTask() {
  //1,get code
  //2,compile code
  //3,collect result

}

function UnExtWithSuitableFormat(file, out_dir) {
  if (!fs.existsSync(out_dir)) fs.mkdirSync(out_dir,{recursive: true});
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
  RunCommand("%s --prefix=%s %s", configure_path, config.output_path, configure_shared_libs);

  if (config.after_build) {
    path_opt.Push(bld_path);
    const shell_path = path.join(config.work_path, config.after_build);
    RunCommand(shell_path);
    path_opt.Pop();
  }
  RunCommand("make");
  RunCommand("make install");
  path_opt.Pop();
}

function Build(repe_path, config) {
  //
  if (config.before_compile) {
    path_opt.Push(repe_path);
    const shell_path = path.join(config.work_path, config.before_compile);
    RunCommand(shell_path);
    path_opt.Pop();
  }
  if (config.env_set) {
    path_opt.Push(repe_path);
    const env_path = path.join(config.work_path, config.env_set);
    const env_path_str = fs.readFileSync(env_path).toString();
    const env_obj = JSON.parse(env_path_str);
    user_envs.AddEnv(env_obj);
    path_opt.Pop();
  }
  //
  const dst_bld_path = path.join(repe_path, "bld");
  if (!fs.existsSync(dst_bld_path)) fs.mkdirSync(dst_bld_path,{recursive: true});
  if (config.build_type == "configure") {
    if (config.use_clang) {
      user_envs.AddEnv({"CC": "/usr/bin/clang"});
    }
    BuildByCOnfigure(dst_bld_path, path.join(repe_path, "configure"), config);
    user_envs.RemoveEnv("CC");
  }else if (config.build_type == "cmake") {
    var cmake_params = "";
    if (config.cmake_params_file) {
      const cmake_params_file_path = path.join(config.work_path, config.cmake_params_file);
      cmake_params = fs.readFileSync(cmake_params_file_path).toString();
    }
    if (config.use_clang) {
      cmake_params = cmake_params + " -DCMAKE_C_COMPILER=clang-3.8 -DCMAKE_CXX_COMPILER=clang++-3.8 "
    }
    RunCommand("cmake -DCMAKE_VERBOSE_MAKEFILE:BOOL=ON -S%s -B%s -DCMAKE_INSTALL_PREFIX:PATH=%s %s %s", repe_path, dst_bld_path, config.output_path,cmake_shared_libs, cmake_params);
    path_opt.Push(dst_bld_path);
    RunCommand("make");
    RunCommand("make install");
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
  const output_path = path.join(dst_path, "output");

  user_envs.AddEnv({"THIRD_PART_OUTPUT_DIR" : output_path});

  //replace script tmp
  ReplaceScriptTmp([/\{OUTPUT_PATH\}/g], output_path);

  if (!fs.existsSync(dst_path)) fs.mkdirSync(dst_path,{recursive: true});
  if (!fs.existsSync(downlaod_dst_path)) fs.mkdirSync(downlaod_dst_path,{recursive: true});
  if (!fs.existsSync(output_path)) fs.mkdirSync(output_path,{recursive: true});

  path_opt.Push(dst_path);

  config_obj.packages.forEach((v) => {
    console.log(v);

    v.output_path = path.join(output_path, v.name);
    v.work_path = work_path;
    if (v.use_clang == undefined) {
      v.use_clang = config_obj.use_clang;
    }

    if (fs.existsSync(v.output_path)) {
      console.log(util.format("pass : %s, you can delete this dir for recompile.", v.output_path));
      return;
    }
    if (v.type == "git") {
      if (v.path) {
        //get code
        RunCommand('git clone %s', v.path);
        const repe_path = path.join(dst_path, v.name);
        RunCommand("git -C %s reset --hard %s", repe_path, v.commit_id);

        //compile
        Build(repe_path, v);
        //cpy dst file
      }
    } else if (v.type == "url") {
      const ext_path = path.join(dst_path, v.name);
      const file_name = v.path.substring(v.path.lastIndexOf('/') + 1);
      const local_path = path.join(downlaod_dst_path, file_name);
      if (!fs.existsSync(local_path)) {
        path_opt.Push(downlaod_dst_path);
        RunCommand("wget %s", v.path);
        path_opt.Pop();
      }
      UnExtWithSuitableFormat(local_path, ext_path);
      const repe_path = path.join(ext_path, v.subdir);

      Build(repe_path, v);
    }
  });
}

RunByConfig("custom_config.json");