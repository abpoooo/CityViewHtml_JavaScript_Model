// 1. get all the relative dom elements to use for rendering
// 2. fetch pictures from backend
// 3. render them
let objs = {
    body: null,
    inputImg: null,
    btnSearch: null,
    carousel: null,
    preUrl: null,
    btnPrev: null,
    btnNext:  null,
    page: {
        cursor:1,
        total:1,
    }
}
const unPlash_key = `JOpyuYXk80EpXc5qImPYcq0PoKKaHRJq6fGaAhI-vq4`
const strClassSelected = 'selected'


objs.body = document.querySelector('body')
objs.inputImg= document.querySelector('.searchBar input')
objs.btnSearch = document.querySelector('.searchBar button')
objs.carousel = document.querySelector('.gallery')
objs.btnPrev = document.querySelector('.btnNav.prev')
objs.btnNext = document.querySelector('.btnNav.next')

const cbInput = function (){
    objs.inputImg.addEventListener('keyup',function (evt){
        if (evt.key === 'Enter' && objs.inputImg.value.trim().length){
            fetchData()
        }
    })
}

const setKeyEvent =function (){
// input: keyup

    objs.inputImg.addEventListener('keyup', cbInput)

//     todo: add more extra key event here

    objs.body.addEventListener('keyup', (evt)=> {
        if (evt.key === 'ArrowLeft'){
            prePage()
        }
        if (evt.key === 'ArrowRight'){
            nextPage()
        }
    })

//
    let arrEle = [objs.inputImg, objs.btnPrev, objs.btnNext]
    let evtName = ['keyup', 'click', 'click']
    let arrCB = [cbInput, prePage, nextPage]

    arrEle.forEach(function (ele,index){
        ele.addEventListener(evtName[index],arrCB[index])
    })
}

const prePage = function (){
    if (objs.page.cursor > 1){
        objs.page.cursor--
    }

    fetchData()
}

const nextPage = function (){
    if (objs.page.cursor < objs.page.total){
        objs.page.cursor++
    }

    fetchData()
}

const fetchData = function (){
    const newImg = objs.inputImg.value.trim().toLowerCase() || 'beijing'
    fetch(`https://api.unsplash.com/search/photos?client_id=${unPlash_key}&query=${newImg}&orientation=landscape&page=${objs.page.cursor}`)
        .then(response => response.json())
        .then(data => {
        //    todo: render image carousel
        //     console.log('data raw:', data)
            // if the results are in the data then,
            renderImage(data.results)
            objs.page.total = data.total_pages
        })
}
///////////////////////

const renderImage = function (arrImages){
//     set the background image with new data got
    const img = arrImages[0].urls.full
    objs.body.style.background = `url('${img}') no-repeat center center fixed`

//     create our carousel
    createCarousel(arrImages)
}

const updateBackgroundImage = function (url){
    objs.body.style.background = `url('${url}') no-repeat center center fixed`
}

const setImageSelected = function (eleImage){
    let images = document.querySelectorAll('[data-index]')
    images.forEach(function (ele){
        ele.className = ''
    })

    eleImage.className = strClassSelected
}

const createCarousel = function (arrImages){
//    1. for loop or while loop
//    2. forEach
    objs.carousel.innerHTML = ''
    for (let i = 0; i < arrImages.length; i++){
        let item = document.createElement('div')
        if (i === 0) {
            item.className = strClassSelected
        }

        const img = arrImages[i].urls.regular
        item.style.background =`url('${img}') no-repeat center center fixed`
        item.dataset.index = i
        item.style.animation = 'fadeIn 0.25s'
        item.style.animationDelay = `${0.1 * i}`
        item.dataset.url = arrImages[i].urls.full
        objs.carousel.appendChild(item)

        item.addEventListener('click', function (evt){
            updateBackgroundImage(evt.target.dataset.url)
            setImageSelected(evt.target)
            objs.preUrl = null
        })

        item.addEventListener('mouseenter',function (evt){
            let newUrl1 = evt.target.dataset.url
            //replace the background image temporary
            if (!objs.preUrl) {
            //    save the previous image url before replacement
            //    use indexOf() to find the first " position and indexOf(,position) to find
            //    the next " position and then slice the two parts to find the url link
                let str = objs.body.style.background
                let iStart = str.indexOf('"')
                let iEnd = str.indexOf('"',iStart +1)
                str = str.slice(iStart +1 , iEnd)
                objs.preUrl = str
                updateBackgroundImage(newUrl1)
            }

        })

        item.addEventListener('mouseleave',function (evt){
            if (objs.preUrl){
                updateBackgroundImage(objs.preUrl)
                objs.preUrl = null
            }
        })

    }
}



fetchData()
setKeyEvent()
objs.btnSearch.addEventListener('click', fetchData)