# Usamos una imagen oficial de Python
FROM python:3.10-slim

# Crear el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiar el archivo de requerimientos desde la carpeta backend
COPY ./backend/requirements.txt /app/requirements.txt

# Instalar las dependencias de Python
RUN pip install --no-cache-dir -r /app/requirements.txt

# Copiar todo el código del proyecto desde la carpeta backend
COPY ./backend /app

# Exponer el puerto 8000 para el servidor de desarrollo de Django
EXPOSE 8000

# Comando para iniciar el servidor Django
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
