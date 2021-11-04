set(CMAKE_SYSTEM_NAME QNX)
set(CMAKE_SYSTEM_PROCESSOR x64)

set(arch gcc_ntox86_64)
set(ntoarch x86_64)
set(QNX_PROCESSOR x86_64)

set(CMAKE_C_COMPILER qcc -D_QNX_SOURCE)
set(CMAKE_C_COMPILER_TARGET ${arch})

set(CMAKE_CXX_COMPILER q++ -D_QNX_SOURCE )
set(CMAKE_CXX_COMPILER_TARGET ${arch})

set(CMAKE_ASM_COMPILER qcc -V${arch})
set(CMAKE_ASM_DEFINE_FLAG "-Wa,--defsym,")

set(CMAKE_FIND_ROOT_PATH /home/yc/qnx710/target/qnx7/usr)

set(CMAKE_FIND_ROOT_PATH_MODE_PROGRAM BOTH)
set(CMAKE_FIND_ROOT_PATH_MODE_LIBRARY BOTH) #libpng find libm.so
set(CMAKE_FIND_ROOT_PATH_MODE_INCLUDE ONLY)
set(CMAKE_FIND_ROOT_PATH_MODE_PACKAGE ONLY)