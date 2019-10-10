# Implemented equations

### Energies and effective field

In micromagnetics, the effective field can be computed from the total micromagnetic energy

```math
\vec{H}_{\mathrm{eff}}=-\frac{1}{\mu_{0} M_{s}} \frac{\delta E}{\delta \vec{m}}
```

The typical energy terms are

- **Exchange energy**

```math
E_\mathrm{ex} = \int_{V} A (\nabla \vec{m})^2 \mathrm{d}V
```
where ``(\nabla \vec{m})^{2}=\left(\nabla m_{x}\right)^{2}+\left(\nabla m_{y}\right)^{2}+\left(\nabla m_{z}\right)^{2}``.
So the corresponding effective field is
```math
\vec{H}_{\mathrm{ex}}=\frac{2 A}{\mu_{0} M_{s}} \nabla^{2} \vec{m}
```

- **Zeeman energy**
```math
E_\mathrm{ex} = -  \mu_0 \int_{V}  \vec{H} \cdot \vec{M} \mathrm{d}V
```
as expected, the effective field is ``\vec{H}``.

- **Anisotropy**

The uniaxial anisotropy energy is given by
```math
E_\mathrm{anis} = -\int_{V} K_{u} (\vec{m} \cdot \hat{u})^2 \, dV
```
from which the effective field can be computed as
```math
\vec{H}_{\mathrm{an}}=\frac{2 K_u}{\mu_0 M_s}\left(\vec{m} \cdot \hat{u}\right) \hat{u}
```

- **Cubic Anisotropy**

The cubic anisotropy energy is given by
```math
E_\mathrm{cubic} = -\int_{V} K_c (m_x^4 + m_y^4 + m_z^4) \, dV
```
and thus the corresponding effective field reads
```math
\vec{H}_{\mathrm{cubic}}= \frac{4 K_c}{\mu_0 M_s}  
\left( m_x^3 \mathbf{e}_x + m_y^3 \mathbf{e}_y + m_z^3 \mathbf{e}_z \right) 
```

- **Bulk DMI energy**
The Bulk DMI energy reads

```math
E_{\mathrm{dmi}} = \int_V D \vec{m} \cdot (\nabla \times \vec{m}) \, \mathrm{d}V
```

so the effective field is

```math
\vec{H}_\mathrm{D}=-\frac{2 D}{\mu_{0} M_{s}}(\nabla \times \vec{m})
```

- **Magnetostatic energy**
```math
E_{\mathrm{d}}=-\frac{\mu_{0}}{2} \int_{V} \vec{H}_{\mathrm{d}}(\mathbf{r}) \cdot
\vec{M}(\mathbf{r}) d V
```
```math
\vec{H}_{\mathrm{d}}(\mathbf{r})=\frac{1}{4 \pi}\left(\int_{V} \rho_{m}\left(\mathbf{r}^{\prime}\right) \frac{\mathbf{r}-\mathbf{r}^{\prime}}{\left|\mathbf{r}-\mathbf{r}^{\prime}\right|^{3}} \mathrm{d}^{3} r^{\prime}+\int_{S} \sigma_{m}\left(\mathbf{r}^{\prime}\right) \frac{\mathbf{r}-\mathbf{r}^{\prime}}{\left|\mathbf{r}-\mathbf{r}^{\prime}\right|^{3}} \mathrm{d}^{2} r^{\prime}\right)
```

## LLG equation

The LLG equation is written as

```math
\frac{\partial \vec{m}}{\partial t} = - \gamma \vec{m} \times \vec{H} + \alpha \vec{m} \times  \frac{\partial \vec{m}}{\partial t}
```

and the corresponding LL form is given by

```math
(1+\alpha^2)\frac{\partial \vec{m}}{\partial t} = - \gamma \vec{m} \times \vec{H} - \alpha \gamma \vec{m} \times (\vec{m} \times \vec{H})
```

## LLG equation with extensions

For the driver `LLG_STT_CPP` the implemented equations is

```math
\frac{\partial \vec{m}}{\partial t} = - \gamma \vec{m} \times \vec{H} + \alpha \vec{m} \times  \frac{\partial \vec{m}}{\partial t}
+ (\vec{u} \cdot \nabla) \vec{m} - \beta [\vec{m}\times (\vec{u} \cdot \nabla)\vec{m}] - a_J \vec{m} \times (\vec{m} \times \vec{p})
 - \eta a_J \vec{m} \times \vec{p}
```

The simulation related to spin transfer torques (in-plane and current-perpendicular-to-plane) and the spin orbit torques can use the `LLG_STT_CPP` driver.
## Steepest descent method
We provide a steepest descent energy minimization method for a complicated system, which is of the form

```math
x_{k+1} = x_k + \alpha_k d_k
```
where
```math
d_k = - \nabla f(x_k)
```
And for the micromagnetics, we have
```math
\mathbf{m}_{k+1} = \mathbf{m}_{k} - {\tau}_k \mathbf{m}_k  \times (\mathbf{m}_k \times \mathbf{H}_{\mathrm{eff}})
```
In practice, we use the following update rule to keep the magnetization vector normalized.

```math
\boldsymbol{m}_{k+1}=\boldsymbol{m}_{k}-{\tau}_k \frac{\boldsymbol{m}_{k}+\boldsymbol{m}_{k+1}}{2} \times\left(\boldsymbol{m}_{k} \times \boldsymbol{H}_{\mathrm{eff}}\left(\boldsymbol{m}_{k}\right)\right)
```
```math
\boldsymbol{m}_{k+1}^2 = \boldsymbol{m}_{k}^2
```
From the equation we have:
```math
(1+\frac{{\tau}_k^2}{4} \boldsymbol{f}_k^2)\mathbf{m}_{k+1} =
(1-\frac{{\tau}_k^2}{4} \boldsymbol{f}_k^2)\mathbf{m}_{k} -  {\tau}_k \mathbf{g}_k
```
where

```math
\begin{aligned}
\mathbf{f}_k& = \mathbf{m}_k \times \mathbf{H}_{\mathrm{eff}}
\\\boldsymbol{g}_{k} &=\boldsymbol{m}_{k} \times\left(\boldsymbol{m}_{k} \times \boldsymbol{H}_{\mathrm{eff}}\right)
\end{aligned}
```
The step size $\tau_k$  can be computed by

```math
\tau_{k}^{1}=\frac{\sum_{i} \boldsymbol{s}_{k-1}^{i} \cdot \boldsymbol{s}_{k-1}^{i}}{\sum_{i} \boldsymbol{s}_{k-1}^{i} \cdot \boldsymbol{y}_{k-1}^{i}} \quad, \quad \tau_{k}^{2}=\frac{\sum_{i} \boldsymbol{s}_{k-1}^{i} \cdot \boldsymbol{y}_{k-1}^{i}}{\sum_{i} \boldsymbol{y}_{k-1}^{i} \cdot \boldsymbol{y}_{k-1}^{i}}
```
where

```math
\begin{aligned}  \boldsymbol{s}_{k-1} &=\boldsymbol{m}_{k}-\boldsymbol{m}_{k-1} \\ \boldsymbol{y}_{k-1} &=\boldsymbol{g}_{k}-\boldsymbol{g}_{k-1} \end{aligned}
```



## Monte Carlo Simulation

For triangular mesh (2D), the system energy reads

```math
H= \sum_{\langle i, j\rangle}  \vec{D}_{i j} \cdot\left(\vec{S}_{i} \times \vec{S}_{j}\right)
-J \sum_{\langle i, j\rangle} \vec{S}_{i} \cdot \vec{S}_{j}- \lambda \sum_{\langle i, j\rangle} S_{i}^{z} S_{j}^{z}
-K \sum_{i}\left(S_{i}^{z}\right)^{2}
```

where

```math
\vec{D}_{i j} = D \hat{z} \times \hat{r}_{ij}  + D_z^{j} \hat{z}
```

## Eigenvalue Method
Micromagnetic system and the corresponding atomistic model are the classical system. The resonance frequencies
and the spatial resonance modes can be obtained using the eigenvalue method. In JuMag, we implemented
a simple eigenvalue method for the following Hamiltonian of the atomistic model

```math
\mathcal{H} = -J \sum_{\langle i, j\rangle} \vec{m}_{i} \cdot \vec{m}_{j} + \sum_{\langle i, j\rangle}  \vec{D}_{i j} \cdot\left(\vec{m}_{i} \times \vec{m}_{j}\right) - K \sum_{i}\left(m_{i}^{z}\right)^{2} - \mu_s \vec{m}_i \cdot \vec{H}
```

For a given ground state or metastable spin configuration
```math
\vec{m}_0=(\sin\theta \cos \phi, \sin\theta \sin \phi, \cos\theta)^T,
```
one can construct a local coordinate system such that
```math
\vec{m} = w \vec{m}_0 + u \vec{e}_\theta + v  \vec{e}_\phi,
```
where $\vec{e}_\theta =(\cos \theta \cos \phi, \cos\theta \sin\phi,-\sin \theta)^T$ and
$\vec{e}_\phi=(-\sin \phi, \cos\phi,0)^T$. In matrix form,

```math
\begin{bmatrix}
m_x \\ m_y \\ m_z
 \end{bmatrix} =
 \begin{bmatrix}
 \cos \phi \cos \theta & -\sin \phi & \sin \theta \cos \phi \\
 \sin \phi \cos \theta &  \cos \phi & \sin \theta \sin \phi \\
 -\sin \theta & 0 &  \cos \theta \\
 \end{bmatrix}
  \begin{bmatrix}
 u \\ v \\ w
 \end{bmatrix}.
```

Under this transformation, the unperturbed spin configuration $\vec{m}_0$ corresponds
to $u=0, v=0$ and $w=1$.
In this local coordinate, the effective fields are given by
```math
\vec{H}_\mathrm{eff} = - \frac{1}{\mu_s} \frac{\partial \mathcal{H}}{\partial \vec{m}}
= - \frac{1}{\mu_s}\left(  \frac{\partial \mathcal{H}}{\partial w} \vec{m}_0 +
\frac{\partial \mathcal{H}}{\partial u} \vec{e}_\theta + \frac{\partial \mathcal{H}}{\partial v} \vec{e}_\phi \right).
```
Substituting the effective fields into the LLG equation, we obtain for the case that $\alpha=0$
```math
\begin{split}
\dot{u} &= -\gamma (- w H_v + v H_w),\\
\dot{v} &= -\gamma ( w H_u - u H_w),
\end{split}
```
where ``H_w``, ``H_u`` and ``H_v`` are effective fields along ``\vec{m}_0``, ``\vec{e}_\theta`` and ``\vec{e}_\phi``, respectively.
To linearize the LLG equation, we assume ``|u| \ll 1``, ``|v| \ll 1`` and
thus $w \approx 1- (1/2)(u^2+v^2)$. Moreover, we look for the solutions such that $u=\tilde{u}e^{-i\omega t}$
and $v=\tilde{v}e^{-i\omega t}$.
Therefore, we arrive at
```math
\begin{split}\label{eq_llg_uv}
 -i \omega \mu_s  \tilde{u}  =  \gamma (\tilde{h}_v - \tilde{v} \tilde{H}_w) , \\
-i \omega \mu_s \tilde{v}  =  - \gamma (\tilde{h}_u-\tilde{u} \tilde{H}_w),
\end{split}
```
where we have ignored the higher-order terms.  In addition, the above equation can be rewritten in a matrix form~\cite{Lin2014a}
```math
\frac{i \omega \mu_s}{\gamma}  
\begin{bmatrix}
\vec{u} \\ \vec{v}
 \end{bmatrix} = \mathbf{A}  
 \begin{bmatrix}
\vec{u} \\ \vec{v}
 \end{bmatrix},
```
where we have introduced two vectors $\vec{u}=(\tilde{u}_1, \tilde{u}_2, ..., \tilde{u}_n)^T$ and
$\vec{v}=(\tilde{v}_1, \tilde{v}_2, ..., \tilde{v}_n)^T$. Therefore,
the normal modes of the system can be obtained through solving the eigenvalues of the matrix $\mathbf{A}$.
The eigenvalues are pure imaginary numbers since $\omega$ is real. The related effective fields are given by
```math
\begin{align}
&\tilde{H}_w = -(\partial \mathcal{H}^{(0)}/{\partial w}) \big|_{w=1} \\
&\tilde{h}_u = -(\partial \mathcal{H}^{(2)}/{\partial u}) \big|_{w=1, u=\tilde{u}, v=\tilde{v}} \\
&\tilde{h}_v = -(\partial \mathcal{H}^{(2)}/{\partial v}) \big|_{w=1, u=\tilde{u}, v=\tilde{v}} .
\end{align}
```

- **Exchange interaction**
```math
\begin{gather}
\begin{split}
&\tilde{H}^\mathrm{ex}_{w, i} = J  \sum_j \left [ \cos \theta_i \cos \theta_j + \sin \theta_i \sin \theta_j  \cos(\phi_i-\phi_j) \right],\\
&\tilde{h}^\mathrm{ex}_{u, i} =  J \sum_j \left [ \tilde{u}_j \cos(\phi_i-\phi_j) \cos \theta_i \cos \theta_j + \tilde{u}_j \sin \theta_i \sin \theta_j + \tilde{v}_j \cos\theta_i \sin (\phi_i - \phi_j)  \right], \\
&\tilde{h}^\mathrm{an}_{v, i} =   J \sum_j \left [  -\tilde{u}_j \cos\theta_j \sin (\phi_i - \phi_j) + \tilde{v}_j \cos(\phi_i-\phi_j)  \right].
\end{split}
\end{gather}
```
- **DMI**
```math
\begin{gather}
\begin{split}
\tilde{H}^\mathrm{dmi}_{w, i} =&  \sum_{j \in X} D_{ij}  \left(  \sin \theta_j \sin \phi_j \cos \theta_i - \sin \theta_i \sin \phi_i \cos \theta_j \right) + \\
    & \sum_{j \in Y} D_{ij}  \left(  \sin \theta_i \cos \phi_i \cos \theta_j - \sin \theta_j \cos \phi_j \cos \theta_i  \right) + \\
    & \sum_{j \in Z} D_{ij}   \left [  \sin \theta_i \sin \theta_j \sin(\phi_i-\phi_j) \right],
\end{split}
\end{gather}
```
where $D_{ij}=D\mathrm{sgn}(j-i)$ with $\mathrm{sgn}(x)$ the sign function. The sets $X$, $Y$ and $Z$ represent the neighbours of
site $i$ in $x$-, $y$- and $z$-axis. Meanwhile, $\tilde{h}^\mathrm{dmi}_{u, i}$ and $\tilde{h}^\mathrm{dmi}_{v, i}$ are given by
```math
\begin{gather}
\begin{split}
\tilde{h}^\mathrm{dmi}_{u, i} =  &  \sum_{j \in X} D_{ij} \left(
 \tilde{u}_j \sin \theta_j \sin \phi_i \cos \theta_i - \tilde{u}_j \sin \theta_i \sin \phi_j \cos \theta_j - \tilde{v}_j \sin \theta_i \cos\phi_j \right) +\\
&\sum_{j\in Y} D_{ij} \left (\tilde{u}_j \sin \theta_i \cos \phi_j \cos \theta_j - \tilde{u}_j \sin \theta_j \cos \phi_i \cos \theta_i - \tilde{v}_j \sin \theta_i \sin\phi_j  \right) + \\
&\sum_{j\in Z} D_{ij} \cos \theta_i  \left [ \tilde{u}_j  \cos \theta_j \sin(\phi_i- \phi_j) -\tilde{v}_j \cos(\phi_i-\phi_j)  \right ],\\
\tilde{h}^\mathrm{dmi}_{v, i} = &\sum_{j \in X} D_{ij}  \tilde{u}_j \sin \theta_j \cos\phi_i + \textstyle \sum_{j \in Y} D_{ij} \tilde{v}_j \sin \theta_j  \sin\phi_i + \\
                  &{\sum_{j \in Z}} D_{ij} \left[ \tilde{u}_j  \cos \theta_j  \cos(\phi_i -\phi_j) + \tilde{v}_j \sin (\phi_i-\phi_j) \right].
\end{split}
\end{gather}
```

- **Anisotropy**
For anisotropies with $\mathcal{H}_{an} = - \sum_{i} (K_x m_{x,i}^2 +  K_z m_{z,i}^2)$, these fields are given by
```math
\begin{gather}
\begin{split}
&\tilde{H}^\mathrm{an}_{w, i} = 2K_x\cos^2 \phi_i \sin^2 \theta_i +  2K_z \cos^2 \theta_i, \\
&\tilde{h}^\mathrm{an}_{u, i} =  2K_x \cos \phi_i \cos \theta_i (\tilde{u}_i \cos\phi_i \cos \theta_i - \tilde{v}_i \sin\phi_i) +2 K_z \tilde{u}_i \sin^2\theta_i, \\
&\tilde{h}^\mathrm{an}_{v, i} = 2K_x \sin \phi_i (-\tilde{u}_i \cos\phi_i \cos \theta_i + \tilde{v}_i \sin\phi_i ).
\end{split}
\end{gather}
```

- **Zeeman Field**
For a static external field $\vec{H}=(H_x, H_y, H_z)$, one obtains
$\tilde{h}_u = \tilde{h}_v = 0$ and
$\tilde{H}^a_{w, i} = H_z \cos \theta_i + H_x \cos \phi_i \sin \theta_i + H_y \sin \phi_i \sin \theta_i$.