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

Процедура Пауза(Секунд = 10) Экспорт
	
	ТекущийСеансИнформационнойБазы = ПолучитьТекущийСеансИнформационнойБазы();
	ФоновоеЗадание = ТекущийСеансИнформационнойБазы.ПолучитьФоновоеЗадание();
	
	Если ФоновоеЗадание = Неопределено Тогда
		Параметры = Новый Массив;
		Параметры.Добавить(Секунд);
		ФоновоеЗадание = ФоновыеЗадания.Выполнить("ПУБ_РегламентныеЗаданияСлужебный.Пауза", Параметры); // Тут указываем имя общего модуля, в котором лежит данная процедура
	КонецЕсли;
	
	Попытка
		ФоновоеЗадание.ОжидатьЗавершения(Секунд);
	Исключение
		Возврат;
	КонецПопытки;
	
КонецПроцедуры

// Выполняет произвольный алгоритм
// 
// Параметры:
//  Алгоритм - Строка - Алгоритм
Процедура ПроизвольныйАлгоритм(Алгоритм) Экспорт
	
	//@skip-check server-execution-safe-mode
	Выполнить(Алгоритм);
	
КонецПроцедуры

Процедура ФоноваяБлокировка(Область = "Справочник.Ф_ОбъектыМетаданных", Время = 30) Экспорт
	
	Блокировка = Новый БлокировкаДанных();
	Блокировка.Добавить(Область).Режим = РежимБлокировкиДанных.Исключительный;
	
	НачатьТранзакцию();
	//@skip-check lock-out-of-try
	Блокировка.Заблокировать();
	
	Пауза(Время);
	
КонецПроцедуры

#КонецОбласти
