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

Функционал: Фильтрация данных

Контекст:

	Дано выполнена настройка подключения

Сценарий: Поиск по табличной части

	Когда Я ищу записи "Справочник.Ф_Номенклатура" внешней системы "RAT_REST" по условиям
		| Реквизит                            | Значение       |
		| Наименование                        | ТестТовар      |
	Тогда количество элементов результата запроса равно "0"

Сценарий: Различные условия поиска

	Когда Я ищу записи "Справочник.Ф_ОбъектыМетаданных" внешней системы "RAT_REST" по условиям
		| Реквизит          | Значение  | Условие |
		| Тип               | Справочник | Равно |
		| ПометкаУдаления   | Истина    | НеРавно |

	Когда Я ищу записи "Справочник.Ф_ОбъектыМетаданных" внешней системы "RAT_REST" по условиям
		| Реквизит          | Значение  | Условие |
		| Тип               | Справочник | Равно |
		| ПометкаУдаления   | Истина    | НеРавно |
		| Наименование      | Ф_Номенклатура | ВСписке |

	Когда Я ищу записи "Справочник.Ф_ОбъектыМетаданных" внешней системы "RAT_REST" по условиям
		| Реквизит          | Значение  | Условие |
		| Тип               | Справочник | Равно |
		| ПометкаУдаления   | Истина    | НеРавно |
		| Наименование      | Ф_Номенклатура;Ф_Склады | НеВСписке |

	Когда Я ищу записи "Справочник.Ф_ОбъектыМетаданных" внешней системы "RAT_REST" по условиям
		| Реквизит        | Значение  | Условие |
		| Тип             | Справочник | Равно |
		| ПометкаУдаления | Ложь      | Равно |
		| Наименование    | Ф_Номенклатура;Ф_Склады | ВСписке |

	Тогда Я создаю таблицу данных "Отбор"
		| Реквизит        | Значение  | Условие |
		| Тип             | Справочник | Равно |
		| ПометкаУдаления | Ложь      | Равно |
		| Наименование    | Ф_Номенклатура;Ф_Склады | ВСписке |
	Когда Я ищу записи "Справочник.Ф_ОбъектыМетаданных" внешней системы "RAT_REST" по условиям "$Отбор$"
