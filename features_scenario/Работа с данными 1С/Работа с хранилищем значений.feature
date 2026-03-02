#language: ru

#©######################################################################/©#
#
#  This file is a part of RAT.
#
#  Copyright © 2021-2026
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

Функционал: Работа с хранилищем значений

Сценарий: Создание номенклатуры с картинкой (base64)

	Дано Я запоминаю значение выражения '"Номенклатура" + Строка(Новый УникальныйИдентификатор)' в переменную "УникальноеИмяНоменклатуры"
	И Я создаю запись "Справочник.ПУБ_Номенклатура" внешней системы "ЭтаБаза"
		| Наименование | $УникальноеИмяНоменклатуры$ |
		| Картинка     | base64:VGVzdA==             |
	И Я сохраняю в переменную "ИдентификаторНоменклатуры" реквизит результата запроса "id"
	И Я получаю запись "Справочник.ПУБ_Номенклатура.$ИдентификаторНоменклатуры$" внешней системы "ЭтаБаза"
	И реквизит результата запроса "Наименование" равен "$УникальноеИмяНоменклатуры$"
	И реквизит результата запроса "Картинка" равен "base64:VGVzdA=="
