export const themes = [
  {
    id: 'default',
    name: '默认主题',
    description: '内置默认主题。',
    styleSheet: `
h1 {
  font-family: initial;
  font-size: 30px;
  padding: 0.25em;
  background: #2196f3;
  color: #fff;
  font-weight: bold;
  width: fit-content;
  margin: 1em 0;
}

h1:first-child {
  margin-top: 0;
}

h1:last-child {
  margin-bottom: 0;
}

h2 {
  font-family: initial;
  font-size: 27px;
  font-weight: bold;
  padding-left: 0.3em;
  border-left: 0.3em #2196f3 solid;
  margin: 1em 0;
}

h2:first-child {
  margin-top: 0;
}

h2:last-child {
  margin-bottom: 0;
}

h3 {
  font-family: initial;
  font-size: 24px;
  color: #2196f3;
  font-weight: bold;
  margin: 1em 0;
}

h3:first-child {
  margin-top: 0;
}

h3:last-child {
  margin-bottom: 0;
}

h4 {
  font-family: initial;
  font-size: 21px;
  font-weight: bold;
  margin: 1em 0;
}

h4:first-child {
  margin-top: 0;
}

h4:last-child {
  margin-bottom: 0;
}

h5 {
  font-family: initial;
  font-size: 18px;
  font-weight: bold;
  margin: 1em 0;
}

h5:first-child {
  margin-top: 0;
}

h5:last-child {
  margin-bottom: 0;
}

h6 {
  font-family: initial;
  font-size: 15px;
  font-weight: bold;
  margin: 1em 0;
}

h6:first-child {
  margin-top: 0;
}

h6:last-child {
  margin-bottom: 0;
}

p {
  font-family: initial;
  font-size: 15px;
  line-height: 1.8em;
  line-break: break-word;
  text-align: justify;
  margin: 1em 0;
}

a {
  text-decoration: none;
  color: #2196f3;
}

p:first-child {
  margin-top: 0;
}

p:last-child {
  margin-bottom: 0;
}

li {
  font-family: initial;
  font-size: 15px;
  line-height: 1.8em;
  line-break: break-word;
  text-align: justify;
  margin: 0.5em 0;
}

:not(pre) code {
  line-break: break-word;
  padding: 0.2em 0.4em;
  font-size: 85%;
  border-radius: 0.2em;
  background-color: rgba(0, 0, 0, 0.1);
}

pre {
  border-radius: 8px;
  font-size: 15px;
}

blockquote {
  padding: 15px;
  background: #e5e6ea;
  margin: 0;
  border-left: 4px #2196f3 solid;
}
    `,
  },
];

export const baseStyleSheet = `
img {
  max-width: 100%;
}

pre code {
  overflow-x: auto;
}

.gallery-wrapper {
  width: 100%;
  overflow: hidden;
  border-radius: 8px;
}

.gallery {
  width: 100%;
  display: flex;
  flex-wrap: nowrap;
  overflow-x: scroll;
  font-size: 0;
  border-radius: 8px;
  background: #121212;
}

.gallery-image-wrapper {
  width: 100%;
  flex-shrink: 0;
  display: flex;
  align-items: center;
}

.gallery-image-wrapper:not(:first-child) {
  margin-left: 8px;
}

.gallery-image-wrapper:not(:last-child) {
  margin-right: 8px;
}

.gallery-image {
  width: 100%;
}
`;
