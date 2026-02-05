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

Функционал: Проверка работы с базой БСП

Контекст:

	Дано выполнена настройка подключения

Сценарий: Работа со справочниками

	Дано Я запоминаю значение выражения '"Номенклатура" + Строка(Новый УникальныйИдентификатор)' в переменную "УникальноеИмяНоменклатуры"
	И Я создаю запись "Справочник.Ф_Номенклатура" внешней системы "RAT_REST"
		| Наименование       | $УникальноеИмяНоменклатуры$ |
		| Код | ТЕСТ001 |
	И Я сохраняю в переменную "НоваяНоменклатура" реквизит результата запроса "presentation"
	И Я создаю структуру "Отбор"
		| 'Наименование' | '$НоваяНоменклатура$' |
	И Я изменяю записи "Справочник.Ф_Номенклатура" внешней системы "RAT_REST" соответствующие отбору "$Отбор$" установив
		| 'Код' | 'ТЕСТ002' |
	И Я получаю запись "Справочник.Ф_Номенклатура.$НоваяНоменклатура$" внешней системы "RAT_REST"
	И реквизит результата запроса "Наименование" равен "$УникальноеИмяНоменклатуры$"
	И реквизит результата запроса "Код" равен "ТЕСТ002"
