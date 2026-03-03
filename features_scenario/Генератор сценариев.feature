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

Сценарий: Открытие формы выбора регистра с неподдерживаемым типом ресурса

	Дано Я открываю форму "Обработка.РатГенераторСценариев.Форма.Форма"
	И в поле с именем "ТипОбъекта" я ввожу текст "РегистрСведений.Ф_ХранилищеЗначений"
	И я нажимаю клавишу "Enter"
	Когда в таблице с именем "ВыбранныеЗаписиРегистра" я нажимаю кнопку "Добавить"
