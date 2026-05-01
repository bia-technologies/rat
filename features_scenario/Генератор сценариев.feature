#language: ru

#©######################################################################/©#
#
#  This file is a part of RAT.
#
#  Copyright © 2021-2025
#  BIA-Technologies Limited Liability Company and contributors
#
#  SPDX-License-Identifier: LGPL-3.0-or-later
#
#  RAT is free software: you can redistribute it and/or modify
#  it under the terms of the GNU Lesser General Public License as published by
#  the Free Software Foundation; either version 3 of the License, or
#  (at your option) any later version.
#
#  RAT is distributed in the hope that it will be useful,
#  but WITHOUT ANY WARRANTY; without even the implied warranty of
#  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
#  GNU Lesser General Public License for more details.
#
#  You should have received a copy of the GNU Lesser General Public License
#  along with RAT. If not, see <https://www.gnu.org/licenses/>.
#
#©######################################################################/©#

@tree

Функционал: Генератор сценариев

Сценарий: Формирование скрипта создания записи регистра с неподдерживаемым типом ресурса

	Дано Я создаю запись "РегистрСведений.Ф_ХранилищеЗначений" внешней системы "ЭтаБаза"
		| Измерение | Тестовое измерение |
		| Ресурс    | Тестовое значение  |
	И Я подключаю клиент тестирования "Этот клиент" из таблицы клиентов тестирования
	И я закрываю все окна клиентского приложения
	И Я открываю основную форму обработки "РатГенераторСценариев"
	Тогда открылось окно 'Генератора сценариев Gherkin: Форма'
	И в поле с именем "ИмяИсточникаДанных" я ввожу текст "ЭтаБаза"
	И в поле с именем "ТипОбъекта" я ввожу текст "Ф хранилище значений"
	И я перехожу к следующему реквизиту
	Когда в таблице "ВыбранныеЗаписиРегистра" я добавляю строку
	Тогда открылось окно 'Ф хранилище значений'
	И в таблице 'Список' количество строк "больше" 0
	И в таблице 'Список' я перехожу к первой строке
	И в таблице "Список" я выбираю текущую строку
	И я закрываю текущее окно
	Тогда открылось окно 'Генератора сценариев Gherkin: Форма'
	Когда я нажимаю на кнопку с именем "СфмироватьСкриптСоздания"
	Тогда поле с именем 'Скрипт' заполнено
	И значение поля с именем 'Скрипт' содержит текст "И Я создаю запись"
	И значение поля с именем 'Скрипт' содержит текст 'И Я создаю запись "РегистрСведений.Ф_ХранилищеЗначений" внешней системы "ЭтаБаза"'
	И значение поля с именем 'Скрипт' содержит текст "| Ресурс"
