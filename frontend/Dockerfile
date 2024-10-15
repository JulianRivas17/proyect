# Usamos una imagen oficial de Node.js
FROM node:18-alpine

# Crear el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiamos los archivos de dependencias
COPY ./package.json /app/package.json

# Instalamos las dependencias de React
RUN npm install

# Copiamos todo el código del proyecto al contenedor
COPY . /app

# Exponemos el puerto 3000 para el servidor de desarrollo de React
EXPOSE 3000

# Comando para iniciar la aplicación React
CMD ["npm", "start"]
