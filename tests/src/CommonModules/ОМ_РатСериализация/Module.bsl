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
	
	ЮТТесты.ВТранзакции()
		.ДобавитьТест("СериализованноеЗначение_Ссылка")
			.СПараметрами("Справочники.ПУБ_Номенклатура", "CatalogRef.Ф_Номенклатура")
			.СПараметрами("Документы.ПУБ_Чек", "DocumentRef.Ф_Чек")
		.ДобавитьТест("СериализованноеЗначение_Перечисление")
			.СПараметрами(Перечисления.Ф_ВидыОпераций.Приход, "EnumRef.Ф_ВидыОпераций", "Приход")
			.СПараметрами(Перечисления.Ф_ТипыОбъектов.Документ, "EnumRef.Ф_ТипыОбъектов", "Документ")
	;
	
КонецПроцедуры

Процедура СериализованноеЗначение_Ссылка(ТипОбъекта, ОжидаемыйType) Экспорт
	
	Ссылка = ЮТест.Данные().КонструкторОбъекта(ТипОбъекта)
		.ФикцияОбязательныхПолей()
		.Записать();
	
	Результат = РатСериализация.СериализованноеЗначение(Ссылка);
	
	ЮТест.ОжидаетЧто(Результат)
		.Заполнено()
		.ИмеетТип("Структура")
		.Свойство("type").Равно(ОжидаемыйType)
		.Свойство("id")
			.ИмеетТип("Строка")
			.ИмеетДлину(36)
		.Свойство("presentation").Равно(Строка(Ссылка))
	
КонецПроцедуры

Процедура СериализованноеЗначение_Перечисление(ЗначениеПеречисления, ОжидаемыйType, Идентификатор) Экспорт
	
	Результат = РатСериализация.СериализованноеЗначение(ЗначениеПеречисления);
	
	ЮТест.ОжидаетЧто(Результат)
		.Заполнено()
		.ИмеетТип("Структура")
		.Свойство("type").Равно(ОжидаемыйType)
		.Свойство("id")
			.Равно(Идентификатор)
		.Свойство("presentation").Равно(Строка(ЗначениеПеречисления))
	
КонецПроцедуры

#КонецОбласти

#Область СлужебныеПроцедурыИФункции

#КонецОбласти
