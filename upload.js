// private func convectore
function bytesToSize(bytes) {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']

    if (!bytes) {
        return '0 Byte'
    }

    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)))

    return Math.round(bytes / Math.pow(1024, i)) + ' ' + sizes[i]
}

const element = (tag, classes = [], content) => {
    const node = document.createElement(tag)

    if (classes.length) {
        node.classList.add(...classes)
    }

    if (content) {
        node.textContent = content
    }

    return node
}

function noop() {}

export function upload(selector, options = {}) {
    let files = []

    const onUpload = options.onUpload ?? noop

    const input = document.querySelector(selector)

    const preview = element('div', ['preview'])
    const open = element('button', ['btn-up'], 'Open')
    const upload = element('button', ['btn-up', 'primary'], 'Uploading')
    upload.style.display = 'none'

    // treatment options
    if (options.multi) {
        input.setAttribute('multiple', true)
    }

    if (options.accept && Array.isArray(options.accept)) {
        input.setAttribute('accept', options.accept.join(','))
    }

    // inserting elements
    input.insertAdjacentElement('afterend', preview)
    input.insertAdjacentElement('afterend', upload)
    input.insertAdjacentElement('afterend', open)


    // method click func triggerInput
    const triggerInput = () => input.click()

    // method change func changeHandler
    const changeHandler = (event) => {

        // treatment None
        if (!event.target.files.length){
            return
        }

        files = Array.from(event.target.files)
        preview.innerHTML = ''

        upload.style.display = 'inline'

        files.forEach(file => {

            // treatment None for image
            if (!file.type.match('image')) {
                return
            }

            const reader = new FileReader()

            reader.onload = (ev) => {
                const src = ev.target.result
                preview.insertAdjacentHTML('afterbegin', `
                    <div class="preview-image">
                    <div class="preview-remove" data-name="${file.name}">&times;</div>
                        <img src="${src}" alt="${file.name}"/>
                        <div class="preview-info">
                            <span>${file.name}</span>
                            ${bytesToSize(file.size)}
                        </div>
                    </div>
                `)
            }

            reader.readAsDataURL(file)
        })

    }

    // method click func removeHandler
    const removeHandler = (event) => {
        if (!event.target.dataset.name) {
            return
        }

        const {name} = event.target.dataset
        files = files.filter(file => file.name !== name)

        if (!files.length) {
            upload.style.display = 'none'
        }

        const block = preview
        .querySelector(`[data-name="${name}"]`)
        .closest('.preview-image')

        block.classList.add('removing')
        setTimeout( () => block.remove(), 300)
    }

    // specialist func clearPreview
    const clearPreview = (el) => {
        el.style.bottom = '4px'
        el.innerHTML = '<div class="preview-info-progress"></div>'
    }

    // method click func uploadHandler
    const uploadHandler = () => {
        preview.querySelectorAll('.preview-remove').forEach(e => e.remove())

        const previewInfo = preview.querySelectorAll('.preview-info')
        previewInfo.forEach(clearPreview)

        onUpload(files)   
    }

    // events call methods
    open.addEventListener('click', triggerInput)
    input.addEventListener('change', changeHandler)
    preview.addEventListener('click', removeHandler)
    upload.addEventListener('click', uploadHandler)

}