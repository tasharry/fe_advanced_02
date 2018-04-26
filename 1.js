'use strict';

class Component {

    static renderPage() {
        document.body.innerHTML = '';
        let sortedComponents = this._all.sort((a, b) => b.order - a.order);
        for (let component of sortedComponents) {
            document.body.appendChild(component.render());
        }
    }

    constructor(model) {
        this._model = model;
        this._order = 0;
        this._index = Component._all.push(this) - 1;
    }

    set view(value) {
        this._view = value;
    }

    set order(value) {
        this._order = value;
    }

    get order() {
        return this._order;
    }

    render() {
        let renderedHTML = this._view;
        for (let [k, v] of Object.entries(this._model)) {
            renderedHTML = renderedHTML.replace("{" + k + "}", v);
        }

        this._element = document.createElement(this._model.parent);
        this._element.innerHTML = renderedHTML;
        return this._element;
    };

    delete() {
        Component._all.splice(this._index, 1);
        this._element.remove();
    }
}

Component._all = [];

class MenuComponent extends Component {

    constructor(model) {
        super(model);
    }

    set data(value) {
        this._data = value;
    }

    renderData(items) {
        let menuHTML = '<ul>';
        for (let item of items) {
            if (item.items) {
                menuHTML += `<li><a href="${item.url}">${item.name}</a>`;
                menuHTML += this.renderData(item.items);
                menuHTML += '</li>';
            } else {
                menuHTML += `<li><a href="${item.url}">${item.name}</a></li>`;
            }
        }
        menuHTML += '</ul>';
        return menuHTML;
    }

    render() {
        let renderedHTML = this.renderData(this._data);
        this._element = document.createElement(this._model.parent);
        this._element.innerHTML = renderedHTML;
        return this._element;
    }
}

class ArticleComponent extends MenuComponent {
    constructor(model) {
        super(model);
    }

    renderData(items) {
        let articleHTML = '<section>';
        for (let item of items) {
            articleHTML += '<article>';
            articleHTML += `<h3>${item.name}</h3>`;
            articleHTML += `<p>${item.text}</p>`;
            articleHTML += `<p><a href="${item.url}">Read  more..</a></p>`;
            articleHTML += '</article>';
        }
        articleHTML += '</section>';
        return articleHTML;
    }
}

let renderPage = (...components) => {

};


const headerComponent = new Component({
    parent: 'header',
    url: 'https://upload.wikimedia.org/wikipedia/ru/5/5b/DreamWorks_Animation_SKG_logo.png',
    label: 'Label'
});


const menuComponent = new MenuComponent({parent: 'nav'});
const articleComponent = new ArticleComponent({parent: 'main'});
const footerComponent = new Component({parent: 'footer', label: '&copy; Copyright 2058, Example Corporation'});

headerComponent.view = '<h1><img src="{url}" alt=""/>{label}</h1>';
menuComponent.view = '<ul>{li}</ul>';
articleComponent.view = '<section>{article}</section>';
footerComponent.view = '<footer><small>{label}</small></footer>';

menuComponent.data = [
    {
        name: 'Главная',
        url: 'www'
    },
    {
        name: 'O нас',
        url: 'www',
        items: [
            {name: 'Кто мы', url: 'www'},
            {name: 'Где мы', url: 'www'},
            {
                name: 'Откуда',
                url: 'www',
            }
        ]
    },
    {
        name: 'Контакты',
        url: 'www'
    }
];
articleComponent.data = [
    {name: 'Статья 1', url: 'www', text: 'Some text for you'},
    {name: 'Статья 2', url: 'www', text: 'Some text for you'},
    {name: 'Статья 3', url: 'www', text: 'Some text for you'}
];

headerComponent.order = 2;
footerComponent.order = 1;
articleComponent.order = 3;

Component.renderPage();

footerComponent.delete();
