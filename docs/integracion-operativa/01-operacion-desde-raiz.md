# Operacion Desde Raiz

## Objetivo

Operar todo desde la raiz de Integracion sin entrar a carpetas hijas, con control segmentado para no romper otros componentes.

## Script unificado

Archivo:
- scripts/docker-manage.ps1

Sintaxis:

```powershell
.\scripts\docker-manage.ps1 <accion> <sistema> [scope]
```

- accion: up, down, restart, rebuild, logs, status, health
- sistema: integration, his, portal, all
- scope: all, his, portal, infra (solo aplica para sistema=integration)

## Ejemplos utiles

### 1) Ver estado de integracion

```powershell
.\scripts\docker-manage.ps1 status integration all
```

### 2) Reiniciar solo portal dentro de integracion

```powershell
.\scripts\docker-manage.ps1 restart integration portal
```

### 3) Rebuild solo backend HIS dentro de integracion

```powershell
.\scripts\docker-manage.ps1 rebuild integration his
```

### 4) Ver logs solo del HIS de integracion

```powershell
.\scripts\docker-manage.ps1 logs integration his
```

### 5) Operar HIS standalone (repositorio VitalFlowHis)

```powershell
.\scripts\docker-manage.ps1 status his
.\scripts\docker-manage.ps1 rebuild his
```

### 6) Operar Portal standalone (repositorio VitalFlowPortal)

```powershell
.\scripts\docker-manage.ps1 status portal
.\scripts\docker-manage.ps1 rebuild portal
```

## Regla de seguridad operativa

- Si vas a tocar solo HIS: usa sistema=integration con scope=his, o sistema=his.
- Si vas a tocar solo Portal: usa sistema=integration con scope=portal, o sistema=portal.
- Evita sistema=all para cambios rutinarios.

## Nota sobre puertos

Pueden convivir stack de integracion y stacks standalone, pero hay que revisar puertos para evitar conflictos.
Si hay colisiones, levantar solo el stack objetivo del cambio.
