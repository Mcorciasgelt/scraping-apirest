const express = require("express")
const app = express ()

const fs = require('fs')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const PORT = 3000

app.get('/', (req, res) => {
    res.send('Servidor funcionando correctamente')
});

const scraping = require('./scraping')
app.use('/scraping', scraping)


app.get('/noticias', (req, res) => {
    try {
        const data = fs.readFileSync('noticias.json', 'utf-8')
        const noticias = JSON.parse(data)
        res.json(noticias)
    } catch (error) {
        console.error('Error al leer noticias:', error.message)
        res.status(500).json({ error: 'Error al leer las noticias' })
    }
});


app.post('/noticias', (req, res) => {
    try {
        const nuevaNoticia = req.body

        const data = fs.readFileSync('noticias.json', 'utf-8')
        const noticias = JSON.parse(data)

        noticias.push(nuevaNoticia)
        fs.writeFileSync('noticias.json', JSON.stringify(noticias, null, 2))

        res.status(201).json({ message: 'Noticia agregada', nuevaNoticia })
    } catch (error) {
        console.error('Error al agregar noticia:', error.message);
        res.status(500).json({ error: 'Error al agregar la noticia' })
    }
})

app.put('/noticias/:id', (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        const data = fs.readFileSync('noticias.json', 'utf-8')
        const noticias = JSON.parse(data)

        noticias[id] = { ...noticias[id], ...req.body }

        fs.writeFileSync('noticias.json', JSON.stringify(noticias, null, 2))

        res.json({ message: 'Noticia actualizada', noticia: noticias[id] })
    } catch (error) {
        console.error('Error al actualizar noticia:', error.message);
        res.status(500).json({ error: 'Error al actualizar la noticia' })
    }
})

app.delete('/noticias/:id', (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        const data = fs.readFileSync('noticias.json', 'utf-8');
        const noticias = JSON.parse(data);

        if (id < 0 || id >= noticias.length) {
            return res.status(404).json({ error: 'Noticia no encontrada' });
        }

        const noticiaEliminada = noticias.splice(id, 1);

        fs.writeFileSync('noticias.json', JSON.stringify(noticias, null, 2));

        res.json({ message: 'Noticia eliminada', noticia: noticiaEliminada });
    } catch (error) {
        console.error('Error al eliminar noticia:', error.message);
        res.status(500).json({ error: 'Error al eliminar la noticia' });
    }
})

app.listen(PORT, () => {
    console.log(`El servidor está escuchando en http://localhost:${PORT}`)
    
})