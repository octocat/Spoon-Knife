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

CAction::CAction(int actionID, unsigned int state, float posX, float posY, float offsetX, float offsetY, const std::string &name)
  : m_id(actionID)
  , m_name(name)
  , m_holdTime(state)
{
  m_amount[0] = posX;
  m_amount[1] = posY;
  m_amount[2] = offsetX;
  m_amount[3] = offsetY;
  for (unsigned int i = 4; i < max_amounts; ++i)
    m_amount[i] = 0;
}

CAction::CAction(int actionID, float amount1 /* = 1.0f */, float amount2 /* = 0.0f */, const std::string &name /* = "" */, unsigned int holdTime /*= 0*/)
  : CAction(actionID, holdTime, amount1, amount2, 0, 0, name)
{}

CAction::CAction(int actionID, wchar_t unicode)
  : CAction(actionID, 0, 0, 0, 0, 0, "")
{
  m_unicode = unicode;
}

CAction::CAction(int actionID, const std::string &name, const CKey &key)
  : CAction(actionID, key.GetHeld(), 1, 0, 0, 0, name)
{
  m_buttonCode = key.GetButtonCode();
  m_amount[0] = Amount0FromButtonCode(key);
  m_amount[1] = Amount1FromButtonCode(key);
}

CAction::CAction(int actionID, const std::string &name)
  : CAction(actionID, 0, 0, 0, 0, 0, name)
{}

bool CAction::IsAnalog() const
{
  return CButtonTranslator::IsAnalog(m_id);
}
