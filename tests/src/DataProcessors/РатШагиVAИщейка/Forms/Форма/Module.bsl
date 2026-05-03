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
// контекст фреймворка Vanessa-Automation
Перем Ванесса Экспорт; // BSLLS:ExportVariables-off

&НаКлиенте
// Структура, в которой хранится состояние сценария между выполнением шагов.
// Очищается перед выполнением каждого сценария.
Перем Контекст Экспорт; // BSLLS:ExportVariables-off

&НаКлиенте
// Структура, в которой можно хранить служебные данные между запусками сценариев.
// Существует, пока открыта форма Vanessa-Automation.
Перем КонтекстСохраняемый Экспорт; // BSLLS:ExportVariables-off

#КонецОбласти

//@skip-check module-structure-top-region
#Область ИнтерфейсVA
// BSLLS:MissingParameterDescription-off
// BSLLS:MissingReturnedValueDescription-off

&НаКлиенте
// Функция экспортирует список шагов Ищейки, которые нужны только тестовому окружению.
Функция ПолучитьСписокТестов(КонтекстФреймворкаBDD) Экспорт

	Ванесса = КонтекстФреймворкаBDD;

	Шаги = Новый Массив;
	Ванесса.ДобавитьШагВМассивТестов(Шаги,
		"СравнениеВерсийИщейкиВКлиентеТестированияСодержитТекст(Текст)",
		"СравнениеВерсийИщейкиВКлиентеТестированияСодержитТекст",
		"И сравнение версий Ищейки в клиенте тестирования содержит текст ""$Текст$""",
		"Проверяет, что область сравнения версий открытой формы Ищейки содержит ожидаемый текст.",
		"Ищейка",
		Неопределено);

	Возврат Шаги;

КонецФункции

// BSLLS:MissingParameterDescription-on
// BSLLS:MissingReturnedValueDescription-on
#КонецОбласти

///////////////////////////////////////////////////
// Реализация шагов
///////////////////////////////////////////////////

//@skip-check module-structure-top-region
#Область Шаги

&НаКлиенте
Процедура СравнениеВерсийИщейкиВКлиентеТестированияСодержитТекст(Текст) Экспорт

	Команда = РатВзаимодействиеСКлиентомТестирования.НоваяКоманда();
	Команда.Метод = "РатВзаимодействиеСКлиентомТестированияКлиент.СравнениеВерсийИщейкиСодержит";
	Команда.Параметры.Добавить(Текст);

	Если Не РатВзаимодействиеСКлиентомТестирования.ВыполнитьКоманду(Ванесса, Команда) Тогда

		ВызватьИсключение СтрШаблон("Сравнение версий Ищейки не содержит текст ""%1""", Текст);

	КонецЕсли;

КонецПроцедуры

#КонецОбласти
