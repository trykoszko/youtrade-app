const fs = require('fs')
const path = require('path')
const randomstring = require('randomstring')
const Handlebars = require('handlebars')
const slugify = require('slugify')

const {
    Ad,
    Image
} = require('../models')
const { get } = require('http')

// e-mail templates
const source = fs.readFileSync(path.join(__dirname, '../views/emails', 'email.hbs'))
const hbs = Handlebars.compile(source.toString())

module.exports = {

    async index(req, res) {
        const ads = await Ad.findAll({ include: [ { model: Image } ] })
        res
            .status(200)
            .json(ads)
    },

    async my(req, res) {
        const ads = await Ad.findAll({
            where: {
                UserId: req.user.id
            },
            include: [ { model: Image } ]
        })
        res
            .status(200)
            .json(ads)
    },

    async add(req, res) {

        if (!req.body.title) {
            return res
                .status(200)
                .send({
                    success: false,
                    explanation: 'err_no_title'
                })
        }

        if (!req.body.desc) {
            return res
                .status(200)
                .send({
                    success: false,
                    explanation: 'err_no_desc'
                })
        }

        const entry = {
            name: req.body.title,
            slug: slugify(req.body.title),
            UserId: req.user.id,
            desc: req.body.desc,
            price: req.body.price
        }

        const adExists = await Ad.findOne({ where: { slug: slugify(req.body.title) } })
        if (adExists) {
            return res
                .status(200)
                .send({
                    success: false,
                    explanation: 'err_ad_exists'
                })
        }

        Ad.create(entry)
            .then(ad => {
                const {
                    id,
                    slug,
                    name
                } = ad.dataValues
                transporter.sendMail({
                    from: `${process.env.ADMIN_NAME} <${process.env.ADMIN_EMAIL}>`,
                    to: process.env.ADMIN_EMAIL,
                    subject: `New Ad: ${name}`,
                    html: hbs({
                        message: `
                            New Ad!
                            name: ${name}
                            id: ${id}
                        `
                    })
                }, async err => {
                    res
                        .status(201)
                        .send({
                            success: true,
                            explanation: 'ad_created',
                            err: err
                        })
                })
            })
            .catch(err => {
                res
                    .status(400)
                    .send({
                        success: false,
                        explanation: 'err_other_not_registered'
                    })
            })
    },

    async delete(req, res) {

        const {
            id
        } = req.params

        const entry = await Ad.findOne({ where: { id } })
        if (!entry) {
            return res
                .status(400)
                .json({
                    success: false,
                    explanation: 'entry_not_existing'
                })
        }

        if (entry.UserId !== req.user.id) {
            return res
                .status(400)
                .json({
                    success: false,
                    explanation: 'entry_not_owned'
                })
        }

        await entry.destroy()

        return res
            .status(200)
            .json({
                success: true,
                explanation: 'entry_removed'
            })
    },

    async get(req, res) {
        const {
            slug
        } = req.params

        const entry = await Ad.findOne({ where: { slug } })
        if (!entry) {
            return res
                .status(400)
                .json({
                    success: false,
                    explanation: 'entry_not_existing'
                })
        }

        return res
            .status(200)
            .json({
                success: true,
                data: entry
            })

    }

}
