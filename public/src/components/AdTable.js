import React, { useState, useEffect } from 'react'
import {
    Table,
    TableHead,
    TableHeader,
    TableCell,
    TableRow,
    TableBody,
    DataTableSkeleton,
    Button,
    Modal
} from 'carbon-components-react'

export default function AdTable({ endpoint, disallowEdit, token }) {
    const API_URL = process.env.REACT_APP_API_URL

    const tableHeaders = [ 'Name', 'Description', 'Price', 'Image' ]

    const headers = new Headers({
        'Authorization': `Bearer ${token}`
    })

    const [allAdsLoaded, setAllAdsLoaded] = useState(false)
    const [allAds, setAllAds] = useState([])
    const [modalOpen, setModalOpen] = useState(false)
    const [productData, setProductData] = useState('')

    useEffect(() => {
        fetch(`${API_URL}${endpoint}`, {
            headers
          })
            .then(res => res.json())
            .then(
                result => {
                    setAllAdsLoaded(true)
                    setAllAds(result)
                },
                error => {
                    setAllAdsLoaded(false)
                }
            )
    }, [])

    if (!disallowEdit) {
        tableHeaders.push('Delete')
    }

    const deleteItem = itemId => {
        fetch(`${API_URL}/ads/${itemId}`, {
            headers,
            method: 'DELETE'
        })
            .then(res => res.json())
            .then(
                result => {
                    // @todo add error handling if(result)
                    setAllAdsLoaded(false)
                    const filteredAds = allAds.filter(ad => ad.id !== itemId)
                    setAllAds(filteredAds)
                    setAllAdsLoaded(true)
                },
                error => {
                    console.log('error', error)
                    setAllAdsLoaded(true)
                }
            )
    }

    const showItem = itemSlug => {
        fetch(`${API_URL}/ads/${itemSlug}`, {
            headers
        })
            .then(res => res.json())
            .then(
                result => {
                    setProductData(result)
                    setModalOpen(true)
                },
                error => {
                    setProductData(error)
                    setModalOpen(true)
                }
            )
    }

    const MappedAds = props => {
        const {
            ads
        } = props
        return ads.map(ad => (
            <TableRow key={ad.id}>
                <TableCell>
                    <Button kind="ghost" onClick={e => showItem(ad.slug)}>
                        {ad.name}
                    </Button>
                </TableCell>
                <TableCell>
                    {ad.desc}
                </TableCell>
                <TableCell>
                    {ad.price}
                </TableCell>
                <TableCell>
                    {ad.Images ? ad.Images.map(img => <a key={img.id} target="_blank" href={img.url}><img style={{ width: '120px', height: 'auto' }} src={img.url} /></a>) : ''}
                </TableCell>
                {disallowEdit ?? <TableCell><Button kind="danger" onClick={() => deleteItem(ad.id)}>Delete</Button></TableCell>}
            </TableRow>
        ))
    }

    return (
        <div className="table-content">
            {allAdsLoaded ? (
                <>
                    <Table>
                        <TableHead>
                            <TableRow>
                                {tableHeaders.map(header => <TableHeader key={header}>{header}</TableHeader>)}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {allAds ? <MappedAds ads={allAds} /> : false}
                        </TableBody>
                    </Table>
                    {modalOpen ?
                        <Modal
                            primaryButtonText="Close"
                            secondaryButtonText="Wow!"
                            onRequestSubmit={() => setModalOpen(false)}
                            onSecondarySubmit={() => setModalOpen(false)}
                            onRequestClose={() => setModalOpen(false)} open={modalOpen}>
                        <h2>{productData.data.name}</h2>
                        <p>
                            {productData.data.desc}
                            <br /><br />
                            price: {productData.data.price}
                        </p>
                    </Modal> : false}
                </>
            ) : <DataTableSkeleton />}
        </div>
    )
}
