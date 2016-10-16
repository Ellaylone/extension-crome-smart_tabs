/**
 * Создание пустого окна
 * @param {object} params
 * @param {function} callback
 */
app.defineProp('controllerMsg.methods.tab.create.blank', function(params, callback) {
    let valid;
    const kit = this._app.kitCollect.getById(+params.kitId);

    if (kit) {
        valid = true;
        kit.getView()
            .then(kit.getModel)
            .then(model => {

                this._success({
                    model: model
                }, callback);

            })
            .catch(failure.bind(this));
    }

    if (!valid) {
        failure.call(this, params);
    }

    return valid ? true : false;

    function failure(e) {
        this._failure('Не удалось получить данные окна', callback);
        this._app.log('Не удалось получить данные окна', e);
    }
});



/*
 chrome.tabs.create(
 {
 url: 'chrome-extension://ekekhdhcpbbhfldpaoelpcpebkcmnkjh/blank.html',
 active: false
 },
 sendResponse
 );
 */