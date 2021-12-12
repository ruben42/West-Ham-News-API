const PORTA = process.env.PORT || 3000
const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')
const app = express()

const newspapers = [
    {
        name: 'guardian',
        address: 'https://www.theguardian.com/football/westhamunited',
        base: ''
    },
    {
        name: 'thesun',
        address: 'https://www.thesun.co.uk/sport/football/team/1196655/west-ham/',
        base: ''
    },
    {
        name: 'mirror',
        address: 'https://www.mirror.co.uk/all-about/west-ham-united-fc',
        base: ''
    },
    {
        name: 'ds',
        address: 'https://www.dailystar.co.uk/latest/west-ham-fc',
        base: ''
    }
]    

let articles = []

newspapers.forEach(newspaper => {
    axios.get(newspaper.address)
        .then(response => {
            const html = response.data;
            const $ = cheerio.load(html);

            $('a:contains("West Ham")', html).each(function () {
                const title = $(this).text();
                const url = $(this).attr('href');
                articles.push({
                    title,
                    url: newspaper.base + url,
                    source: newspaper.name
                })

            })
        })
})

app.get('/', (req, res) => {
    res.json('Welcome to my West Ham News API')
})

app.get('/news', (req, res) => {
    res.json(articles)
})

app.get('/news/:newspaperId', (req, res) => {
    const newspaperId = req.params.newspaperId

    const newspaperAddress = newspapers.filter(newspaper => newspaper.name == newspaperId)[0].address
    const newspaperBase = newspapers.filter(newspaper => newspaper.name == newspaperId)[0].base

    axios.get(newspaperAddress)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)
            const specificArticles = []

            $('a:contains("West Ham")', html).each(function () {
                const title = $(this).text()
                const url = $(this).attr('href')
                specificArticles.push({
                    title,
                    url: newspaperBase + url,
                    source: newspaperId
                })
            })
            res.json(specificArticles)
        }).catch(err => console.log(err))
})

app.listen(PORTA, () => {
    console.log(`server running on PORT ${PORTA}`)
})