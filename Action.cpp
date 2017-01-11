/*
 *      Copyright (C) 2005-2013 Team XBMC
 *      http://xbmc.org
 *
 *  This Program is free software; you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation; either version 2, or (at your option)
 *  any later version.
 *
 *  This Program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with XBMC; see the file COPYING.  If not, see
 *  <http://www.gnu.org/licenses/>.
 *
 */

#include "input/Action.h"

#include "system.h"
#include "input/Key.h"
#include "input/ButtonTranslator.h"

namespace
{

// Get the action amounts of the analog buttons: Primary amount X or Y
float Amount0FromButtonCode(const CKey& key)
{
  switch (key.GetButtonCode())
  {
    case KEY_BUTTON_LEFT_ANALOG_TRIGGER:
      return key.GetLeftTrigger() / 255.0f;
    case KEY_BUTTON_RIGHT_ANALOG_TRIGGER:
      return key.GetRightTrigger() / 255.0f;
    case KEY_BUTTON_LEFT_THUMB_STICK:
      return key.GetLeftThumbX();
    case KEY_BUTTON_RIGHT_THUMB_STICK:
      return key.GetRightThumbX();
    case KEY_BUTTON_LEFT_THUMB_STICK_UP:
      return key.GetLeftThumbY();
    case KEY_BUTTON_LEFT_THUMB_STICK_DOWN:
      return -key.GetLeftThumbY();
    case KEY_BUTTON_LEFT_THUMB_STICK_LEFT:
      return -key.GetLeftThumbX();
    case KEY_BUTTON_LEFT_THUMB_STICK_RIGHT:
      return key.GetLeftThumbX();
    case KEY_BUTTON_RIGHT_THUMB_STICK_UP:
      return key.GetRightThumbY();
    case KEY_BUTTON_RIGHT_THUMB_STICK_DOWN:
      return -key.GetRightThumbY();
    case KEY_BUTTON_RIGHT_THUMB_STICK_LEFT:
      return -key.GetRightThumbX();
    case KEY_BUTTON_RIGHT_THUMB_STICK_RIGHT:
      return key.GetRightThumbX();
    default: return 1; // digital button (could change this for repeat acceleration)
  }
}

// Get the action amounts of the analog buttons: Secondary amount Y
float Amount1FromButtonCode(const CKey& key)
{
  switch (key.GetButtonCode())
  {
    case KEY_BUTTON_LEFT_THUMB_STICK:
      return key.GetLeftThumbY();
    case KEY_BUTTON_RIGHT_THUMB_STICK:
      return key.GetRightThumbY();
    default: return 1; // digital button (could change this for repeat acceleration)
  }
}

} // anonymous namespace

CAction::CAction(int actionID, float amount1 /* = 1.0f */, float amount2 /* = 0.0f */, const std::string &name /* = "" */, unsigned int holdTime /*= 0*/)
{
  m_id = actionID;
  m_amount[0] = amount1;
  m_amount[1] = amount2;
  for (unsigned int i = 2; i < max_amounts; i++)
    m_amount[i] = 0;
  m_name = name;
  m_repeat = 0;
  m_buttonCode = 0;
  m_unicode = 0;
  m_holdTime = holdTime;
}

CAction::CAction(int actionID, unsigned int state, float posX, float posY, float offsetX, float offsetY, const std::string &name) :
  m_name(name)
{
  m_id = actionID;
  m_amount[0] = posX;
  m_amount[1] = posY;
  m_amount[2] = offsetX;
  m_amount[3] = offsetY;
  for (unsigned int i = 4; i < max_amounts; i++)
    m_amount[i] = 0;
  m_repeat = 0;
  m_buttonCode = 0;
  m_unicode = 0;
  m_holdTime = state;
}

CAction::CAction(int actionID, wchar_t unicode)
{
  m_id = actionID;
  for (unsigned int i = 0; i < max_amounts; i++)
    m_amount[i] = 0;
  m_repeat = 0;
  m_buttonCode = 0;
  m_unicode = unicode;
  m_holdTime = 0;
}

CAction::CAction(int actionID, const std::string &name, const CKey &key) :
  m_name(name)
{
  m_id = actionID;
  m_amount[0] = 1; // digital button (could change this for repeat acceleration)
  for (unsigned int i = 1; i < max_amounts; i++)
    m_amount[i] = 0;
  m_repeat = key.GetRepeat();
  m_buttonCode = key.GetButtonCode();
  m_amount[0] = Amount0FromButtonCode(key);
  m_amount[1] = Amount1FromButtonCode(key);
  m_unicode = 0;
  m_holdTime = key.GetHeld();
}

CAction::CAction(int actionID, const std::string &name) :
  m_name(name)
{
  m_id = actionID;
  for (unsigned int i = 0; i < max_amounts; i++)
    m_amount[i] = 0;
  m_repeat = 0;
  m_buttonCode = 0;
  m_unicode = 0;
  m_holdTime = 0;
}

CAction& CAction::operator=(const CAction& rhs)
{
  if (this != &rhs)
  {
    m_id = rhs.m_id;
    for (unsigned int i = 0; i < max_amounts; i++)
      m_amount[i] = rhs.m_amount[i];
    m_name = rhs.m_name;
    m_repeat = rhs.m_repeat;
    m_buttonCode = rhs.m_buttonCode;
    m_unicode = rhs.m_unicode;
    m_holdTime = rhs.m_holdTime;
    m_text = rhs.m_text;
  }
  return *this;
}

bool CAction::IsAnalog() const
{
  return CButtonTranslator::IsAnalog(m_id);
}
