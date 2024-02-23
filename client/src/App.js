import {md5} from "js-md5";
import {useEffect, useState} from "react";

function App() {
    const date = new Date()
    const timestamp = date.getUTCFullYear() +
      (date.getUTCMonth() > 9 ? (date.getUTCMonth() + 1) : "0" + (date.getUTCMonth() + 1)) +
      (date.getUTCDate() > 9 ? date.getUTCDate() : "0" + date.getUTCDate())
    const pass = 'Valantis'
    const auth = md5(pass + "_" + timestamp)

    const [products, setProducts] = useState([])
    const limit = 50
    const [offset, setOffset] = useState(0)

    const [loading, setLoading] = useState(true)
    const [price, setPrice] = useState('')
    const [name, setName] = useState('')
    const [brand, setBrand] = useState('')

    const priceInput = document.getElementById('price')
    const nameInput = document.getElementById('name')
    const brandInput = document.getElementById('brand')

    const [priceVisible, setPriceVisible] = useState(true)
    const [nameVisible, setNameVisible] = useState(true)
    const [brandVisible, setBrandVisible] = useState(true)

    const [correct, setCorrect] = useState(true)

    useEffect(() => {
        getProducts(limit, offset)
    }, [])

    const setVisibleFilter = (func, input) => {
        priceInput.checked = false
        nameInput.checked = false
        brandInput.checked = false
        input.checked = true
        setPriceVisible(false)
        setNameVisible(false)
        setBrandVisible(false)
        func(true)
    }

    const deleteDuplicates = (arr) => {
        let idArr = []
        let resultArr = []
        arr.map(item => {
            if(idArr.indexOf(item.id) === -1){
                idArr.push(item.id)
                resultArr.push(item)
            }
        })
        return resultArr
    }

    const changePage = (page) => {
        setLoading(true)
        getProducts(limit, page * limit)
    }

    const resetFilters = () => {
        priceInput.checked = false
        nameInput.checked = false
        brandInput.checked = false
        setPriceVisible(true)
        setNameVisible(true)
        setBrandVisible(true)
        setPrice('')
        setName('')
        setBrand('')
        setOffset(0)
        setLoading(true)
        getProducts(limit, 0)
    }

    const setFilters = () => {
        let filterType = ''
        let filterValue = ''

        if(priceInput.checked === true){
            if(price.toUpperCase() === price.toLowerCase()){
                setCorrect(true)
                filterType = "price"
                filterValue = Number(price)
            } else {
                setCorrect(false)
                return
            }
        } else if(nameInput.checked === true){
            filterType = "product"
            filterValue = name
        } else if(brandInput.checked === true){
            filterType = "brand"
            filterValue = brand
        } else {
            return
        }

        console.log(filterType)
        console.log(filterValue)

        let params = {};

        params[filterType] = filterValue;

        console.log(params)
        setLoading(true)
        try {
            fetch('http://api.valantis.store:40000/',{
                method: "POST",
                headers : {
                    'X-Auth' : auth,
                    "Content-type": "application/json; charset=UTF-8"
                },
                body: JSON.stringify({
                    "action": "filter",
                    "params": params
                }),
            }).then(
                response => {
                    response.json().then(result => {
                        fetch('http://api.valantis.store:40000/',{
                            method: "POST",
                            headers : {
                                'X-Auth' : auth,
                                "Content-type": "application/json; charset=UTF-8"
                            },
                            body: JSON.stringify({
                                "action": "get_items",
                                "params": {"ids": result.result}
                            }),
                        }).then(
                            response => {
                                response.json().then(result => {
                                    setProducts(deleteDuplicates(result.result))
                                    setLoading(false)
                                })
                            }
                        )
                    })
                }
            )
        } catch (e) {
            if(e.response.message)
                console.log(e.response.message)
        }
    }

    const getProducts = (limit, offset) => {
        try {
            fetch('http://api.valantis.store:40000/',{
                method: "POST",
                headers : {
                    'X-Auth' : auth,
                    "Content-type": "application/json; charset=UTF-8"
                },
                body: JSON.stringify({
                    "action": "get_ids",
                    "params": {"offset": offset, "limit": limit}
                }),
            }).then(
                response => {
                    response.json().then(result => {
                        fetch('http://api.valantis.store:40000/',{
                            method: "POST",
                            headers : {
                                'X-Auth' : auth,
                                "Content-type": "application/json; charset=UTF-8"
                            },
                            body: JSON.stringify({
                                "action": "get_items",
                                "params": {"ids": result.result}
                            }),
                        }).then(
                            response => {
                                response.json().then(result => {
                                    setProducts(deleteDuplicates(result.result))
                                    setLoading(false)
                                })
                            }
                        )
                    })
                }
            )
        } catch (e) {
            if(e.response.message)
                console.log(e.response.message)
        }
    }

    return (
    <div className="App">
        <div className="content-wrapper">
            <div className="table-wrapper">
                <div
                    className="loader-wrapper"
                    style={loading ? {display: "flex"} : {display: "none"}}
                >
                    <span className="loader"></span>
                </div>
                {products.length !== 0 ?
                    <div className="table">
                        {
                            products.map(product =>
                                <div
                                    key={product.id}
                                    className="table-line"
                                >
                                    <div className="table-cell">
                                        {product.id}
                                    </div>
                                    <div className="table-cell">
                                        {product.product}
                                    </div>
                                    <div className="table-cell">
                                        {product.price} ₽
                                    </div>
                                    <div className="table-cell">
                                        {product.brand === null ? '' : product.brand}
                                    </div>
                                </div>
                            )
                        }
                    </div> : <div></div>
                }
                <div className="btns">
                    <div
                        className={offset === 0 ? "btn disabled" : "btn"}
                        onClick={() => {
                            changePage(offset-1)
                            setOffset(offset-1)
                        }}
                    >
                        Предыдущая страница
                    </div>
                    <div className="cur">
                        {offset + 1}
                    </div>
                    <div
                        className="btn"
                        onClick={() => {
                            changePage(offset+1)
                            setOffset(offset+1)
                        }}
                    >
                        Следующая страница
                    </div>
                </div>
            </div>
            <div className="filters-wrapper">
                <div className="filters-container">
                    <div className="check-wrapper">
                        <input id="price" className="checkbox" type="radio"/>
                        <label
                            onClick={() => {
                                setVisibleFilter(setPriceVisible, priceInput)
                            }}
                            htmlFor="price">
                            <div className={priceVisible ? "filter-wrapper" : "filter-wrapper disabled"}>
                                <div className="filter-title">
                                    Цена, руб.
                                </div>
                                <span
                                    className="danger-message"
                                    style={correct ? {display: "none"} : {display: "block"}}
                                >Некорректное значение</span>
                                <input
                                    onChange={(e) => {
                                        setPrice(e.target.value)
                                    }}
                                    value={price}
                                    className="filter-input" type="text"/>
                            </div>
                        </label>
                    </div>
                    <div className="check-wrapper">
                        <input id="name" className="checkbox" type="radio"/>
                        <label
                            onClick={() => {
                                setVisibleFilter(setNameVisible, nameInput)
                            }}
                            htmlFor="name">
                            <div className={nameVisible ? "filter-wrapper" : "filter-wrapper disabled"}>
                                <div className="filter-title">
                                    Название
                                </div>
                                <input
                                    onChange={(e) => {
                                        setName(e.target.value)
                                    }}
                                    value={name}
                                    className="filter-input" type="text"
                                />
                            </div>
                        </label>
                    </div>
                    <div className="check-wrapper">
                        <input id="brand" className="checkbox" type="radio"/>
                        <label
                            onClick={() => {
                                setVisibleFilter(setBrandVisible, brandInput)
                            }}
                            htmlFor="brand">
                            <div className={brandVisible ? "filter-wrapper" : "filter-wrapper disabled"}>
                                <div className="filter-title">
                                    Бренд
                                </div>
                                <input
                                    onChange={(e) => {
                                        setBrand(e.target.value)
                                    }}
                                    value={brand}
                                    className="filter-input" type="text"
                                />
                            </div>
                        </label>
                    </div>
                </div>
                <div className="buttons-wrapper">
                    <div
                        className="filter-button"
                        onClick={resetFilters}
                    >
                        Сбросить фильтр
                    </div>
                    <div
                        className="filter-button"
                        onClick={() => {
                            setOffset(0)
                            setFilters()
                        }}
                    >
                        Применить
                    </div>
                </div>
            </div>
        </div>
    </div>
    );
}

export default App;
