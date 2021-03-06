"use strict";
/**
 * @type {object} the application object
 */
var app = {
    /**
     * название в глобальной области видимости
     * @type {string}
     */
    globalName: 'app',

    // <debug>

    /**
     * @type {function} @class Ready состояние готовности
     */
    ready: null,

    /**
     * Проверка совместимости
     * @type {function}
     * @file js/compatibility.js
     */
    compatibility: null,

    /**
     * Настройки
     * @type {object}
     * @file js/setup.js
     */
    setup: null,

    /**
     * Constructor for tab
     * @file js/tab/Tab.js
     * @constructor
     */
    Tab: null,

    /**
     * Constructor win
     * @file js/kit/Kit.js
     * @constructor
     */
    Kit: null,

    /**
     * Коллекция вкладок
     * @type {object}
     * @file js/tab/collect.js
     */
    tabCollect: null,

    /**
     * Коллекция окон
     * @type {object}
     * @file js/kit/collect.js
     */
    kitCollect: null,

    /**
     * @type {object} контроллер событий окон и вкладок
     * @file js/controller/event.js
     */
    controllerEvent: null,

    /**
     * @type {object} cинхронизация состояний окон и сохраненных данных
     * @file js/sync.js
     */
    sync: null,

    /**
     * @type {object} создание окон и вкладок
     * @file js/create.js
     */
    create: null,

    /**
     * @type {object} сопоставление вкладок сохраненного окна с реально открытым
     * @file js/mapping.js
     */
    mapping: null,

    /**
     * Хранение настроек приложения
     * @type {object}
     * @file js/store/setup.js
     */
    storeSetup: null,

    /**
     * Хранение данных открытых окон
     * @type {object}
     * @file js/store/open.js
     */
    storeOpen: null,

    /**
     * Хранение данных о недавно закрытых окнах
     * @type {object}
     * @file js/store/open.js
     */
    storeRecent: null,

    /**
     * Ведение логов, регистрация ошибок
     * @type {Function}
     * @file js/log.js
     */
    log: null,

    /**
     * Cостояние активности системы
     * @type {Object}
     * @file js/systemIdle.js
     */
    systemIdle: null,

    // </debug>

    /**
     * @type {Object} data transport object
     * @file js/dto/dto.js
     */
    dto: {},

    /**
     * Дочерним объектам устанавливаем ссылку на объект приложения
     * Если есть метод init - синхронно выполняем
     * После выполнения удаляем init
     *
     * @param {Object} [app] объект, устанавливаемый в качестве объекта приложения
     * @private
     */
    executionInits(app) {
        let key, obj;
        if (!app) {
            app = this;
        }
        for (key in this) {
            if (!this.hasOwnProperty(key)) {
                continue;
            }
            obj = this[key];

            if (!obj || typeof obj !== 'object' || Array.isArray(obj)) {
                continue;
            }

            //
            if (key === '_app') {
                continue;
            }

            obj._app = app;

            if (typeof obj.init === 'function') {
                obj.init.call(obj);
                delete obj.init;
            }
        }
    },

    /**
     * Биндинг методов объекта
     * @param {object} obj ообъект, методам которого биндим контекст
     * @param {object} [scope] контекст
     * @private
     */
    binding(obj, scope) {
        for (let key in obj) {
            if (obj.hasOwnProperty(key) && typeof obj[key] === 'function') {
                obj[key] = obj[key].bind(scope || obj);
            }
        }
    },

    /**
     * Задержка перед запуском приложения
     * @return {Promise<void>}
     * @private
     */
    _timeout() {
        return new Promise(resolve => {
            setTimeout(resolve, this.setup.get('app.launch.timeout'));
        });
    },

    /**
     * Ообработчики сообщений от окон
     */
    _msgHandlers: Object.create(null),

    /**
     * Добавить функцию в список
     * Функции являются обработчиками сообщений от окон
     *
     * @param {string} name путь-название обработчка
     * @param {*} handler содержимое обработчика
     */
    defineMsgHandler(name, handler) {
        this._msgHandlers[name] = handler;
    },

    /**
     * Получить обработчик с именем
     * @param {string} name путь-название обработчка
     * @return {function}
     */
    getMsgHandler(name) {
        return this._msgHandlers[name];
    },

    /**
     * Инициализация
     */
    init() {
        this.Modify = Modify;
        this.Ready = Ready;
        this.Subscribe = Subscribe;

        // поверка совместимости
        if (!this.compatibility()) {
            return;
        }

        this.ready = this.Ready();

        this.executionInits();                      // инициализация

        this.setup.prep()                           // получение настроек
            .then(this._timeout.bind(this))
            .then(this.ready.resolve)               // здесь подготовлен необходимый минимум приложения
            .then(() => {
                this.controllerEvent.enable();
                this.controllerMsg.enable();
                this.systemIdle.run();
            })
            .then(this.sync.all)
            .then(this.create.saved)
            .then(
                () => {
                    console.log('\n-----------------------------------\n\n');
                    console.log('(heap):  ', this.storeOpen._dtoArrRecord);
                    console.log('(kits):  ', this.kitCollect._items);
                    console.log('(tabs):  ', this.tabCollect._items);
                    console.log('\n-----------------------------------\n');
                }
            )


            .catch(e => {
                this.log({
                    e   : e,
                    name: 'Не смогли стартовать приложение'
                });
                //       this.quit();
            })
            // удаление не используемых методов
            .then(() => {
                this.init = null;
                this._timeout = null;
                this.executionInits = null;
                this.binding = null;
            })
    }
};

setTimeout(app.init.bind(app), 1);
