/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
}

module.exports = nextConfig
```

### **Archivo 3: `.gitignore`**
```
node_modules
.next
.env.local
.DS_Store
```

---

## 📁 PASO 3: Crear estructura de carpetas

Dentro de `agencia-esoterica`, crea estas carpetas y archivos:
```
agencia-esoterica/
├── package.json
├── next.config.js
├── .gitignore
├── pages/
│   ├── index.js
│   └── api/
│       └── chat.js
└── styles/
    └── globals.css