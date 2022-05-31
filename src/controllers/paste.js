import Paste from "../models/paste.js";
import hljs from 'highlight.js'
import { escape } from "html-escaper";

// Kaikkien pastejen tarkastelusivu
const getAllPastes = async(req, res, next) => {
    // Haetaan koko tietokannan sisältö arrayhyn ({}) komennolla
    // Varmistetaan samalla että tietokannasta löytyy mitään
    // Jos yhteyttä ei löydy, heitetään virhekoodia 404
    try {
        const pasteItems = await Paste.find({});
        if (!pasteItems) return res.status(404).send();

        // Jos homma toimi, renderöidään kaikkien pastejen tarkastelusivu
        res.render('paste/pasteViewAll', { pasteItems })
    } catch (e) {
        next(e);
    }
}

// Yksittäisen pasten tarkastelu id:n kautta
const getPaste = async(req, res, next) => {
    if (!req.params.id) {
        // Varmistetaan että yhteys toimii, jos serveriltä ei tule vastausta
        // heitetään error 400 Bad gateway
        res.status(400).send();
        return
    }

    try {
        // Haetaan pasten tiedot ja varmistetaan samalla, että paste ylipäänsä löytyy
        // Jos haetulla id:llä ei löydy vastaavuutta, heitetään error 404
        // Page you're trying to reach can not be found
        const paste = await Paste.findById(req.params.id);
        if (!paste) return res.status(404).send();

        // Jos kaikki on kunnossa ja yhteys pelaa, renderöidään yksittäisen pasten tarkastelusivu
        res.render('paste/pasteViewSingle', paste)
    } catch (e) {
        next(e);
    }
}

// Renderöidään uuden pasten luonti-ikkuna
const getCreateNewPaste = (req, res, next) => {
    res.render('paste/pasteViewCreate')
}

// Uuden pasten luominen, ottaa vastaan POST requestin
const postCreateNewPaste = async(req, res, next) => {

    try {
        // Ottaa vastaan POST requestin bodyssä seuraavat tiedot:
        // title, description, body
        const { title, description, body } = req.body

        // Tarkistetaan ettei mikään vaadituista tiedoista ole tyhjä,
        // jos on niin lähetetään error viesti middlewaren käsiteltäväksi
        if (!title || !description || !body) return next('Kaikki kentät tulee täyttää')

        // Luodaan uusi Paste instanssi Paste modelin perusteella
        const paste = new Paste({
            // Poistetaan XSS haavoittuvuus
            title: escape(title),
            description: escape(description),
            // Lisätään highlight.js:n muutokset body datalle eli koodipastelle.
            // highlightAuto metodi yrittää tunnistaa koodin ja laittaa värit sen perusteella.
            // Käsittely hoitaa samalla string escapen body -datalle, mites muut datat?
            body: hljs.highlightAuto(body).value
        });

        // Tallennetaan Paste instanssin data tietokantaan
        const data = await paste.save();

        // Jos tietokanta ei anna vastausta niin toiminto on epäonnistunut
        // ja lähetetään error status 500 - internal server error
        if (!data) {
            return res.status(500).send()
        }


        // Uusi data luotu onnistuneesti
        // Luodaan pasteViewSingle html sivu ja palautetaan se selaimelle luodun paste datan kanssa
        res.render('paste/pasteViewSingle', data)

    } catch (e) {
        // Jos ohjelma kaatuu niin lähetetään error middlewaren käsiteltäväksi
        next(e)
    }
}

// Olemassa olevan pasten poistaminen
// Asynkroninen poisto edellyttää try cathcia
const deletePaste = async(req, res, next) => {
    // Jos tietokanta ei anna vastausta, toiminta epäonnistui ja annetaan error 400 Bad Gateway
    if (!req.params.id) return res.status(400).send();
    try {
        // Haetaan poistettavan pasten tiedot ja varmistetaan, että se on vielä olemassa
        // Jos pastea ei enää löydy, heitetään error 404 Page you're trying to reach can not be found
        const paste = await Paste.findById(req.params.id);
        if (!paste) return res.status(404).send();

        // Jos yhteys pelaa ja paste löytyy, poistetaan paste ja kuitataan onnistuminen
        await paste.delete();

        next("Poisto onnistui")

    } catch (e) {
        next(e);
    }
}

export default {
    getPaste,
    getAllPastes,
    getCreateNewPaste,
    postCreateNewPaste,
    deletePaste
}