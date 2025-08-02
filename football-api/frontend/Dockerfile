# Imagen base con Node.js (Angular CLI necesita Node 20+)
FROM node:22

# Crear directorio de trabajo
WORKDIR /usr/src/app

# Copiar archivos de configuración e instalar dependencias
COPY package*.json ./
RUN npm install -g @angular/cli && npm install

# Copiar el resto del código
COPY . .

# Exponer el puerto 4200
EXPOSE 4200

# Comando por defecto
CMD ["npm", "start", "--", "--host", "0.0.0.0"]
