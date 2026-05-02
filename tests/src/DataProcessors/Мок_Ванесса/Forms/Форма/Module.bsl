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

#Область ОписаниеПеременных

&НаКлиенте
// Структура, в которой хранится состояние сценария между выполнением шагов. Очищается перед выполнением каждого сценария.
Перем Контекст Экспорт; // BSLLS:ExportVariables-off

&НаКлиенте
// Структура, в которой можно хранить служебные данные между запусками сценариев. Существует, пока открыта форма Vanessa-Automation.
Перем КонтекстСохраняемый Экспорт; // BSLLS:ExportVariables-off

#КонецОбласти

#Область ОбработчикиКомандФормы

&НаКлиенте
Процедура СохранитьЗначениеПеременнойВКонтекст(Ключ, Значение) Экспорт
	
	Контекст.Вставить(Ключ, Значение);
	
КонецПроцедуры

&НаКлиенте
Процедура УстановитьРезультатУсловия(Результат) Экспорт

	Контекст.Вставить("РезультатУсловия", Результат);

КонецПроцедуры

#КонецОбласти

#Область СлужебныеПроцедурыИФункции

&НаКлиенте
Процедура Инициализировать() Экспорт
	
	Контекст = Новый Структура;
	КонтекстСохраняемый = Новый Структура;
	
КонецПроцедуры

#КонецОбласти
