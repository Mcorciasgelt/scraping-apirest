const cheerio = require("cheerio")
const axios = require("axios")
const fs = require('fs')

const express = require('express')
const router = express.Router()

router.get('/', async (req, res) => {
    const url = 'https://elpais.com/ultimas-noticias/'
    try {

        const { data } = await axios.get(url)

        const $ = cheerio.load(data)

        let noticias = []

        $('article.c').each((index, element) => {
            const titulo = $(element).find('h2.c_t a').text().trim()
            const descripcion = $(element).find('p.c_d').text().trim()
            const enlace = $(element).find('h2.c_t a').attr('href')
            const imagen = $(element).find('figure.c_m img').attr('src')

            const noticia = {
                id : noticias.length +1, 
                titulo, 
                descripcion, 
                enlace, 
                imagen 
                }

            noticias.push(noticia)
        });

        fs.writeFileSync('noticias.json', JSON.stringify(noticias, null, 2))

        res.json({ message: 'Scraping completado', noticias })
    } catch (error) {
        console.error('Error durante el scraping:', error.message)
        res.status(500).json({ error: 'Error al realizar el scraping' })
    }
})

module.exports = router