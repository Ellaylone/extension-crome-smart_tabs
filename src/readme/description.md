

###

настройки по умолчанию:

глобальные
для окна
для вкладки



track - отслеживать 

view - открытое окно браузера
model - объект, хранящий настройки окна
record - объект с сохраненными данными


win === kit 


kit - объект окна
tab - объект вкладки

e - указывает на событие. Данные, возвращенные api

Не обработанные данные. Прямо от callback
eData (eDataKit || eDataKits || eDataTab || eDataTabs)

Конвертированные данные от api в формат приложения:
Это данные окна браузера со вкладками (view) 

eKit (eKits - массив объектов eKit)
eTab (--||--) вкладки


Сохранненные данные:
storedKit - объект сохранненного окна (storedKits - массив storedKit)
storedTab - вкладка


данные для сохранения:
rawKit (rawKits)
rawTab (rawTabs)



------------------

Объект приложения app
внутри объекта app все свойства - объекты методы имеют привязанный контекст вызова 


синхронизация окон нужна:
при записи
при поиске соответствующей сохраненной записи


окно не может существовать без вкладок


---

view открытое окно браузера
model объект окна браузера, находящийся в памяти
store сохраненные данные окна

---


conjunction
добавление сохраненных данных в модель: store -> model
kit.conjunction(rawSaving) 



__

browserApi

абстракция для браузерного api приводит все методы к одному аргументу
валидация