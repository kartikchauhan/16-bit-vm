### Hardware Virtualization

* Hardware virtualization refers to the creation of a virtual machine that acts like a real computer with an operating system. Software executed on these virtual machines is separated from the underlying hardware resources.

* In hardware virtualization, the host machine is the machine that is used by the virtualization and the guest machine is the virtual machine.

* The software or firmware that creates a virtual machine on the host hardware is called a hypervisor or virtual machine monitor.

* Different types of hardware virtualization include:
    * **Full virtualization** - almost complete simulation of the actual hardware to allow software environments, including a guest operating system and its apps, to run unmodified.

    * **Paravirtualization** - the guest apps are executed in their own isolated domains, as if they are running on a separate system, but a hardware environment is not simulated. Guest programs need to be specifically modified to run in this environment.

    * **Hardware-assisted virtualization** - is a way of improving overall efficiency of virtualization. It involves CPUs that provide support for virtualization in hardware, and other hardware components that help improve the performance of a guest environment.

* A system's memory map may look like this:

| Address Range(hexadecimal) | Size      | Device                  |
| -------------------------- | --------- | ----------------------- |
| 0000–7FFF                  | 32 KiB    | RAM                     |
| 8000–80FF	                 | 256 bytes | General-purpose I/O     |
| 9000–90FF	                 | 256 bytes | Sound controller        |
| A000–A7FF	                 | 2 KiB	 | Video controller/       |
|                            |           | text-mapped display RAM |
| C000–FFFF	                 | 16 KiB    | ROM                     |