# JuMag.jl

_A Julia package for classical spin dynamics and micromagnetic simulations with GPU support._

### How the magnetization is stored in the array `spin`?

In JuMag, the magnetization is stored in a 1D array with the form ``[m_{1,x}, m_{1, y}, m_{1, z}, ..., m_{n,x}, m_{n, y}, m_{n, z}]``

### How to get the global index of magnetization at site ``(i,j,k)`` ?

In JuMag, the global index can be obtained using the following function

```julia
function index(i::Int64, j::Int64, k::Int64, nx::Int64, ny::Int64, nz::Int64)
    if i < 1 || j < 1 || k < 1 || k > nz || j > ny || i > nx
        return -1
    end
    return (k-1) * nx*ny + (j-1) * nx + i
end
```

### How to get the effective field at site ``(i,j,k)``?

The effective field is stored in the same form of the magnetization, so the effective at site `(i,j,k)`
can be extracted using

```julia
  id = index(i,j,k, nx, ny, nz)
  fx = sim.field[3*id-2]
  fy = sim.field[3*id-1]
  fz = sim.field[3*id]
```

Alternatively, we can use reshape function

```julia
  f = reshape(sim.field, 3, nx, ny, nz)
  fx,fy,fz = f[:, i,j,k]
```
