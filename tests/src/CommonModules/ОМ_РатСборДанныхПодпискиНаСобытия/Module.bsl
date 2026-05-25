//©///////////////////////////////////////////////////////////////////////////©//
//
//  This file is a part of RAT.
//
//  Copyright © 2021-2026
//  BIA-Technologies Limited Liability Company and contributors
//
//  SPDX-License-Identifier: LGPL-3.0-or-later
//
//  RAT is free software: you can redistribute it and/or modify
//  it under the terms of the GNU Lesser General Public License as published by
//  the Free Software Foundation; either version 3 of the License, or
//  (at your option) any later version.
//
//  RAT is distributed in the hope that it will be useful,
//  but WITHOUT ANY WARRANTY; without even the implied warranty of
//  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//  GNU Lesser General Public License for more details.
//
//  You should have received a copy of the GNU Lesser General Public License
//  along with RAT. If not, see <https://www.gnu.org/licenses/>.
//
//©///////////////////////////////////////////////////////////////////////////©//

#Область СлужебныйПрограммныйИнтерфейс

Процедура ИсполняемыеСценарии() Экспорт

	ЮТТесты
		.ДобавитьТест("ОбработчикиДокументаДоступныВОбычномКлиенте")
		.ДобавитьТест("ОткрытиеФормыДокументаВОбычномКлиенте")
	;

КонецПроцедуры

Процедура ОбработчикиДокументаДоступныВОбычномКлиенте() Экспорт

#Если ТолстыйКлиентОбычноеПриложение Тогда
	// Arrange
	Отказ = Ложь;

	// Act
	РатСборДанныхПодпискиНаСобытия.ПередЗаписьюДокумента(Неопределено, Отказ, Неопределено, Неопределено);
	РатСборДанныхПодпискиНаСобытия.ПриЗаписиДокумента(Неопределено, Отказ, Неопределено, Неопределено);

	// Assert
	ЮТест.ОжидаетЧто(Отказ, "Обработчики подписок RAT не должны менять отказ без активного сбора данных")
		.ЭтоЛожь();
#Иначе
	ЮТест.Пропустить("Проверка выполняется только в режиме толстого клиента обычного приложения");
#КонецЕсли

КонецПроцедуры

Процедура ОткрытиеФормыДокументаВОбычномКлиенте() Экспорт

#Если ТолстыйКлиентОбычноеПриложение Тогда
	// Arrange
	Форма = Неопределено;

	// Act
	Форма = ПолучитьФорму("Документ.Ф_Чек.ФормаОбъекта");

	// Assert
	ЮТест.ОжидаетЧто(Форма, "Обычная форма документа должна открываться с расширением RAT")
		.НеРавно(Неопределено);
#Иначе
	ЮТест.Пропустить("Проверка выполняется только в режиме толстого клиента обычного приложения");
#КонецЕсли

КонецПроцедуры

#КонецОбласти
