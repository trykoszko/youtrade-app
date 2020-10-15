const fs = require('fs')
const path = require('path')
const randomstring = require('randomstring')
const Handlebars = require('handlebars')

const Ad = require('../models').Ad

// e-mail templates
const source = fs.readFileSync(path.join(__dirname, '../views/emails', 'email.hbs'))
const hbs = Handlebars.compile(source.toString())

module.exports = {

    async add(req, res) {
        if (!req.body.email) {
            res.status(400).send({
                success: false,
                message: 'Błąd: Brak lub nieprawidłowy e-mail'
            })
            return
        }

        if (!req.body.terms_accepted) {
            res.status(400).send({
                success: false,
                message: 'Błąd: Brak akceptacji regulaminu'
            })
            return
        }

        const entry = {
            email: req.body.email,
            terms_accepted: req.body.terms_accepted,
            user_interested: req.body.user_interested
        }

        const mailExists = await Ad.findOne({ where: { email: req.body.email } })
        if (mailExists) {
            return res
                .status(200)
                .send({
                    success: true,
                    message: 'Podany adres e-mail jest już w naszej bazie danych'
                })
        }

        Ad.create(entry)
            .then(ad => {
                const {
                    id,
                    email
                } = ad.dataValues
                const removalKey = randomstring.generate(10)
                // client email
                transporter.sendMail({
                    from: `Korki z Front-endu <${process.env.ADMIN_EMAIL}>`,
                    to: email,
                    subject: 'Dziękuję za rejestrację na Korkach!',
                    replyTo: process.env.ADMIN_EMAIL,
                    html: hbs({
                        message: `
                            Dziękuję za rejestrację na Korkach z Front-endu!
                            <br><br>
                            Wkrótcę zacznę wysyłać Ci informacje odnośnie kolejnej edycji. W międzyczasie możesz <a href="https://t2m.io/fotzFSo6">dołączyć na Facebooku</a>, na <a href="https://t2m.io/v2FaNHR5">Discordzie</a> albo <a href="https://t2m.io/x01RwXQJ">YouTube</a>.
                            <br><br>
                            <small>Pamiętaj, że w każdej chwili możesz wypisać się z listy mailingowej <a href="${process.env.URL}/unsubscribe/newsletter/${email}/${removalKey}">tutaj</a>.</small>
                        `
                    })
                }, async err => {
                    let messageSent = true
                    if (err) {
                        messageSent = false
                    }
                    await Ad.update({ removal_key: removalKey, email_sent: messageSent, email_sent_date: new Date().toString() })
                })
                // admin email
                transporter.sendMail({
                    from: `${process.env.ADMIN_NAME} <${process.env.ADMIN_EMAIL}>`,
                    to: process.env.ADMIN_EMAIL,
                    subject: 'New user on ',
                    replyTo: email,
                    html: hbs({
                        message: `
                            <a href="mailto:${email}">${email}</a>
                            <br>
                            właśnie zarejestrował się na Korkach.
                            <br>
                            [ID: ${id}]
                        `
                    })
                }, async err => {
                    let messageSent = true
                    if (err) {
                        messageSent = false
                        // res
                        //     .status(400)
                        //     .send({
                        //         success: true,
                        //         message: `Dziękuję za zainteresowanie moim szkoleniem. Podany adres e-mail został dodany do bazy mailingowej!`,
                        //         err: err
                        //     })
                    }
                    res
                        .status(201)
                        .send({
                            success: true,
                            message: `Dziękuję za zainteresowanie moim szkoleniem. Podany adres e-mail został dodany do bazy mailingowej!`,
                            err: err
                        })
                })
            })
            .catch(err => {
                console.log('err', err)
                res
                    .status(400)
                    .send({
                        success: false,
                        message: 'Wystąpił błąd. Podany adres e-mail nie został zarejestrowany w naszej bazie.'
                    })
            })
    },

    async remove(req, res) {

        const {
            email,
            removalKey
        } = req.params

        const entry = await Ad.findOne({ where: { email: email } })
        if (!entry) {
            return res
                .status(400)
                .render('apiresponse.hbs', {
                    success: false,
                    messageType: 'error',
                    heading: 'Błąd!',
                    message: 'Podany adres e-mail nie istnieje w naszej bazie danych więc nie został usunięty'
                })
        }

        const isKeyCorrect = removalKey === entry.dataValues.removal_key
        if (isKeyCorrect) {
            await entry.destroy()
        }
        return res
            .status(isKeyCorrect ? 200 : 400)
            .render('apiresponse.hbs', {
                success: true,
                messageType: isKeyCorrect ? 'success' : 'error',
                heading: isKeyCorrect ? 'OK!' : 'Błąd!',
                message: isKeyCorrect
                    ? 'Podany adres e-mail został poprawnie usunięty z bazy danych korkizfrontendu.pl. Szkoda!'
                    : 'Klucz weryfikacyjny nie jest poprawny. Podany adres e-mail NIE został usunięty z bazy danych korkizfrontendu.pl'
            })
    }

}
