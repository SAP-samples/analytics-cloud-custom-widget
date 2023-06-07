//Please insert the ChatGPT-generated Web Component similar to following example




// class NewsTicker extends HTMLElement {
//   constructor () {
//     super()
//     this.attachShadow({ mode: 'open' })
//   }

//   connectedCallback () {
//     const duration = this.getAttribute('duration') || 20
//     const fontSize = this.getAttribute('font-size') || 48

//     const style = document.createElement('style')
//     style.textContent = `
//       .container {
//         display: flex;
//         overflow: hidden;
//         font-size: ${fontSize}px;
//       }
//       .container span {
//         color: rgb(39,168,234);
//         white-space: nowrap;
//         padding: 0 2rem;
//         animation: scrolling ${duration}s linear infinite;
//       }
//       .container span:hover {
//         color: red;
//         cursor: pointer;
//       }
//       @keyframes scrolling {
//         0% {
//           transform: translateX(100%);
//         }
//         100% {
//           transform: translateX(-100%);
//         }
//       }
//     `

//     const container = document.createElement('div')
//     container.className = 'container'

//     Array.from(this.children).forEach((label) => {
//       const labelClone = label.cloneNode(true)
//       container.appendChild(labelClone)
//     })

//     this.shadowRoot.append(style, container)
//   }

//   onCustomWidgetAfterUpdate (changedProps) {
//     this.render()
//   }

//   async render () {
//     const dataBinding = this.dataBinding
//     if (!dataBinding || dataBinding.state !== 'success') { return }

//     const { data, metadata } = dataBinding

//     const news = data.map(row => {
//       const label = row.dimensions_0.label.split(' ')[0]
//       const formatted = row.measures_0.formatted
//       return `${label}: ${formatted}`
//     })

//     const container = this.shadowRoot.querySelector('.container')
//     container.innerHTML = news.map(news => { return `<span>${news}</span>` }).join('\n')
//   }
// }

// customElements.define('news-ticker', NewsTicker)
