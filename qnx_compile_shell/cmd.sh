source /home/yc/qnx710/qnxsdp-env.sh
export  CC="qcc -D_QNX_SOURCE "
export  CXX="q++ -D_QNX_SOURCE"
THIRD_SOURCE_DIR=/home/yc/code/third_source
mkdir -p  ${THIRD_SOURCE_DIR}
mkdir -p  ${THIRD_SOURCE_DIR}/downlaod
mkdir -p  ${THIRD_SOURCE_DIR}/output
cd ${THIRD_SOURCE_DIR}
echo libuv start ...
mkdir -p  ${THIRD_SOURCE_DIR}/bld/libuv
cmake -DCMAKE_VERBOSE_MAKEFILE:BOOL=ON -S${THIRD_SOURCE_DIR}/libuv -B${THIRD_SOURCE_DIR}/bld/libuv -DCMAKE_INSTALL_PREFIX:PATH=${THIRD_SOURCE_DIR}/output/libuv   -DCMAKE_TOOLCHAIN_FILE=${THIRD_SOURCE_DIR}/qnx2.cmake 
cd ${THIRD_SOURCE_DIR}/bld/libuv
make
make install
cd ${THIRD_SOURCE_DIR}
echo libuv stop
echo ogg start ...
mkdir -p  ${THIRD_SOURCE_DIR}/bld/ogg
cmake -DCMAKE_VERBOSE_MAKEFILE:BOOL=ON -S${THIRD_SOURCE_DIR}/ogg/libogg-1.3.5 -B${THIRD_SOURCE_DIR}/bld/ogg -DCMAKE_INSTALL_PREFIX:PATH=${THIRD_SOURCE_DIR}/output/ogg   -DCMAKE_TOOLCHAIN_FILE=${THIRD_SOURCE_DIR}/qnx2.cmake 
cd ${THIRD_SOURCE_DIR}/bld/ogg
make
make install
cd ${THIRD_SOURCE_DIR}
echo ogg stop
echo sqlite start ...
mkdir -p  ${THIRD_SOURCE_DIR}/bld/sqlite
cd ${THIRD_SOURCE_DIR}/bld/sqlite
${THIRD_SOURCE_DIR}/sqlite/configure --prefix=${THIRD_SOURCE_DIR}/output/sqlite --host=x86_64-linux --enable-editline=no 
make
make install
cd ${THIRD_SOURCE_DIR}
echo sqlite stop
echo curl start ...
export QNX_TARGET
mkdir -p  ${THIRD_SOURCE_DIR}/bld/curl
cmake -DCMAKE_VERBOSE_MAKEFILE:BOOL=ON -S${THIRD_SOURCE_DIR}/curl -B${THIRD_SOURCE_DIR}/bld/curl -DCMAKE_INSTALL_PREFIX:PATH=${THIRD_SOURCE_DIR}/output/curl   -DCMAKE_TOOLCHAIN_FILE=${THIRD_SOURCE_DIR}/qnx2.cmake \
-DOPENSSL_INCLUDE_DIR=/home/yc/qnx710/target/qnx7/usr/include/openssl -DOPENSSL_CRYPTO_LIBRARY=/home/yc/qnx710/target/qnx7/x86_64/usr/lib/libcrypto.so -DOPENSSL_SSL_LIBRARY=/home/yc/qnx710/target/qnx7/x86_64/usr/lib/libssl.so

cd ${THIRD_SOURCE_DIR}/bld/curl
make
make install
cd ${THIRD_SOURCE_DIR}
echo curl stop
echo openal-soft start ...
mkdir -p  ${THIRD_SOURCE_DIR}/bld/openal-soft
cmake -DCMAKE_VERBOSE_MAKEFILE:BOOL=ON -S${THIRD_SOURCE_DIR}/openal-soft -B${THIRD_SOURCE_DIR}/bld/openal-soft -DCMAKE_INSTALL_PREFIX:PATH=${THIRD_SOURCE_DIR}/output/openal-soft   -DCMAKE_TOOLCHAIN_FILE=${THIRD_SOURCE_DIR}/qnx2.cmake 
cd ${THIRD_SOURCE_DIR}/bld/openal-soft
make
make install
cd ${THIRD_SOURCE_DIR}
echo openal-soft stop
echo libwebp start ...
mkdir -p  ${THIRD_SOURCE_DIR}/bld/libwebp
cmake -DCMAKE_VERBOSE_MAKEFILE:BOOL=ON -S${THIRD_SOURCE_DIR}/libwebp -B${THIRD_SOURCE_DIR}/bld/libwebp -DCMAKE_INSTALL_PREFIX:PATH=${THIRD_SOURCE_DIR}/output/libwebp   -DCMAKE_TOOLCHAIN_FILE=${THIRD_SOURCE_DIR}/qnx2.cmake 
cd ${THIRD_SOURCE_DIR}/bld/libwebp
make
make install
cd ${THIRD_SOURCE_DIR}
echo libwebp stop
echo openssl start ...
cd /home/yc/code/thrid_repo_build_script
mkdir -p  ${THIRD_SOURCE_DIR}/bld/openssl
cd ${THIRD_SOURCE_DIR}/bld/openssl
#${THIRD_SOURCE_DIR}/openssl/configure --prefix=${THIRD_SOURCE_DIR}/output/openssl --host=x86_64-linux
#make
#make install
cd /home/yc/code/thrid_repo_build_script
echo openssl stop
echo libwebsockets start ...
mkdir -p  ${THIRD_SOURCE_DIR}/bld/libwebsockets
cmake -DCMAKE_VERBOSE_MAKEFILE:BOOL=ON -S${THIRD_SOURCE_DIR}/libwebsockets -B${THIRD_SOURCE_DIR}/bld/libwebsockets -DCMAKE_INSTALL_PREFIX:PATH=${THIRD_SOURCE_DIR}/output/libwebsockets      -DLWS_WITH_LIBUV=ON \
    -DLWS_WITH_SSL=ON \
    -DLWS_WITHOUT_TESTAPPS=ON \
    -DLWS_WITHOUT_TEST_SERVER=ON \
    -DLWS_WITHOUT_TEST_PING=ON \
    -DLWS_WITHOUT_TEST_CLIENT=ON \
    -DLWS_OPENSSL_LIBRARIES="/home/yc/qnx710/target/qnx7/x86_64/usr/lib/libssl.so;/home/yc/qnx710/target/qnx7/x86_64/usr/lib/libcrypto.so" \
    -DLWS_OPENSSL_INCLUDE_DIRS="/home/yc/qnx710/target/qnx7/usr/include/openssl" \
    -DLWS_LIBUV_LIBRARIES="${THIRD_SOURCE_DIR}/output/libuv/lib/libuv.so" \
    -DLWS_LIBUV_INCLUDE_DIRS="${THIRD_SOURCE_DIR}/output/libuv/include" \
    -DCMAKE_BUILD_TYPE=RELEASE \
    -DCMAKE_EXPORT_COMPILE_COMMANDS=ON \
    -DLWS_IPV6=OFF \
    -DLWS_WITH_SHARED=ON \
    -DLWS_WITH_STATIC=ON \
    -D__QNX__=1 \
    -DDISABLE_WERROR=ON -DCMAKE_TOOLCHAIN_FILE=${THIRD_SOURCE_DIR}/qnx2.cmake 
cd ${THIRD_SOURCE_DIR}/bld/libwebsockets
make
make install
cd /home/yc/code/thrid_repo_build_script
echo libwebsockets stop
echo vorbis start ...
export CMAKE_LIBRARY_PATH=${THIRD_SOURCE_DIR}/output/ogg/lib
mkdir -p  ${THIRD_SOURCE_DIR}/bld/vorbis
cmake -DCMAKE_VERBOSE_MAKEFILE:BOOL=ON -S${THIRD_SOURCE_DIR}/vorbis/libvorbis-1.3.7 -B${THIRD_SOURCE_DIR}/bld/vorbis -DCMAKE_INSTALL_PREFIX:PATH=${THIRD_SOURCE_DIR}/output/vorbis   -DCMAKE_TOOLCHAIN_FILE=${THIRD_SOURCE_DIR}/qnx2.cmake \
-DOGG_INCLUDE_DIR=${THIRD_SOURCE_DIR}/output/ogg/include
cd ${THIRD_SOURCE_DIR}/bld/vorbis
make
make install
cd /home/yc/code/thrid_repo_build_script
echo vorbis stop
echo libz start ...
mkdir -p  ${THIRD_SOURCE_DIR}/bld/libz
cmake -DCMAKE_VERBOSE_MAKEFILE:BOOL=ON -S${THIRD_SOURCE_DIR}/libz/zlib-1.2.11 -B${THIRD_SOURCE_DIR}/bld/libz -DCMAKE_INSTALL_PREFIX:PATH=${THIRD_SOURCE_DIR}/output/libz   -DCMAKE_TOOLCHAIN_FILE=${THIRD_SOURCE_DIR}/qnx2.cmake 
cd ${THIRD_SOURCE_DIR}/bld/libz
make
make install
cd /home/yc/code/thrid_repo_build_script
echo libz stop
echo sdl2 start ...
mkdir -p  ${THIRD_SOURCE_DIR}/bld/sdl2
cd ${THIRD_SOURCE_DIR}/bld/sdl2
${THIRD_SOURCE_DIR}/sdl2/SDL2-2.0.16/configure --prefix=${THIRD_SOURCE_DIR}/output/sdl2 --host=x86_64-nto-qnx --enable-audio=false --enable-dependency-tracking=false
make V=1
make install
cd /home/yc/code/thrid_repo_build_script
echo sdl2 stop
echo libpng start ...
export CMAKE_LIBRARY_PATH=/home/yc/qnx710/target/qnx7/x86_64/lib
mkdir -p  ${THIRD_SOURCE_DIR}/bld/libpng
cmake -DCMAKE_VERBOSE_MAKEFILE:BOOL=ON -S${THIRD_SOURCE_DIR}/libpng/libpng-1.6.37 -B${THIRD_SOURCE_DIR}/bld/libpng -DCMAKE_INSTALL_PREFIX:PATH=${THIRD_SOURCE_DIR}/output/libpng   -DCMAKE_TOOLCHAIN_FILE=${THIRD_SOURCE_DIR}/qnx2.cmake \
-DZLIB_INCLUDE_DIR=${THIRD_SOURCE_DIR}/output/libz/include -DZLIB_LIBRARY=${THIRD_SOURCE_DIR}/output/libz/lib/libz.so
export CMAKE_LIBRARY_PATH=""
cd ${THIRD_SOURCE_DIR}/bld/libpng
make
make install
cd /home/yc/code/thrid_repo_build_script
echo libpng stop
echo mpg123 start ...
mkdir -p  ${THIRD_SOURCE_DIR}/bld/mpg123
cd ${THIRD_SOURCE_DIR}/bld/mpg123
${THIRD_SOURCE_DIR}/mpg123/mpg123-1.29.0/configure --prefix=${THIRD_SOURCE_DIR}/output/mpg123 --host=x86_64-linux
make
make install
cd /home/yc/code/thrid_repo_build_script
echo mpg123 stop
echo jpeg start ...
mkdir -p  ${THIRD_SOURCE_DIR}/bld/jpeg
cd ${THIRD_SOURCE_DIR}/bld/jpeg
${THIRD_SOURCE_DIR}/jpeg/jpeg-9d/configure --prefix=${THIRD_SOURCE_DIR}/output/jpeg --host=x86_64-linux
make
make install
cd /home/yc/code/thrid_repo_build_script
echo jpeg stop
echo tbb start ...
mkdir -p  ${THIRD_SOURCE_DIR}/bld/tbb
cmake -DCMAKE_VERBOSE_MAKEFILE:BOOL=ON -S${THIRD_SOURCE_DIR}/tbb -B${THIRD_SOURCE_DIR}/bld/tbb -DCMAKE_INSTALL_PREFIX:PATH=${THIRD_SOURCE_DIR}/output/tbb   -DCMAKE_TOOLCHAIN_FILE=${THIRD_SOURCE_DIR}/qnx2.cmake 
cd ${THIRD_SOURCE_DIR}/bld/tbb
make
make install
cd /home/yc/code/thrid_repo_build_script
echo tbb stop
echo glslang start ...
mkdir -p  ${THIRD_SOURCE_DIR}/bld/glslang
cmake -DCMAKE_VERBOSE_MAKEFILE:BOOL=ON -S${THIRD_SOURCE_DIR}/glslang -B${THIRD_SOURCE_DIR}/bld/glslang -DCMAKE_INSTALL_PREFIX:PATH=${THIRD_SOURCE_DIR}/output/glslang  -DENABLE_HLSL=OFF \
    -DENABLE_SPVREMAPPER=OFF \
    -DSPIRV_SKIP_EXECUTABLES=ON -DCMAKE_TOOLCHAIN_FILE=${THIRD_SOURCE_DIR}/qnx2.cmake -D _QNX_SOURCE=1
cd ${THIRD_SOURCE_DIR}/bld/glslang
make
make install
cd /home/yc/code/thrid_repo_build_script
echo glslang stop