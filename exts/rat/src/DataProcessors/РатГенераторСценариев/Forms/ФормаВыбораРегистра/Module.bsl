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

#Область ОбработчикиСобытийФормы

&НаСервере
Процедура ПриСозданииНаСервере(Отказ, СтандартнаяОбработка)
	
	ОписаниеТаблицы = Неопределено;
	
	Если НЕ Параметры.Свойство("ОписаниеТаблицы", ОписаниеТаблицы) Тогда
		ВызватьИсключение "Некорректный вызов формы. Необходимо передать параметр с описанием таблицы";
	КонецЕсли;
	
	Список.ПроизвольныйЗапрос = Ложь;
	Список.ОсновнаяТаблица = СтрШаблон("%1.%2", ОписаниеТаблицы.ИмяТипа, ОписаниеТаблицы.Имя);
	Список.ДинамическоеСчитываниеДанных = Истина;
	
	Схема = Новый СхемаЗапроса();
	Схема.УстановитьТекстЗапроса("ВЫБРАТЬ РАЗРЕШЕННЫЕ * ИЗ " + Список.ОсновнаяТаблица); // BSLLS:QueryParseError-off
	
	Для Каждого Колонка Из Схема.ПакетЗапросов[0].Колонки Цикл
		
		Попытка
			Элемент = Элементы.Добавить("Список" + Колонка.Псевдоним, Тип("ПолеФормы"), Элементы.Список);
			Элемент.ПутьКДанным = "Список." + Колонка.Псевдоним;
			Элемент.Вид = ВидПоляФормы.ПолеВвода;
		Исключение
			РатОбщийКлиентСервер.СообщитьПользователю("Не удалось добавить колонку: " + Колонка.Псевдоним);
		КонецПопытки;
		
	КонецЦикла;
	
КонецПроцедуры

#КонецОбласти

#Область ОбработчикиСобытийЭлементовТаблицыФормыСписок

&НаКлиенте
Процедура СписокВыбор(Элемент, ВыбраннаяСтрока, Поле, СтандартнаяОбработка)
	
	СтандартнаяОбработка = Ложь;
	
	ОповеститьОВыборе(ВыбраннаяСтрока);
	
КонецПроцедуры

#КонецОбласти
