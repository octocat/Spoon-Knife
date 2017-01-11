/*!
 \file Key.h
 \brief
 */
#pragma once

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

#include <string>
#include <stdint.h>

#ifndef SWIG

#include "input/KeyCodes.h"

/*!
  \ingroup actionkeys
  \brief
  */
class CKey
{
public:
  CKey(uint32_t buttonCode = 0, uint8_t leftTrigger = 0, uint8_t rightTrigger = 0, float leftThumbX = 0.0f, float leftThumbY = 0.0f, float rightThumbX = 0.0f, float rightThumbY = 0.0f, float repeat = 0.0f);
  CKey(uint32_t buttonCode, unsigned int held);
  CKey(uint8_t vkey, wchar_t unicode, char ascii, uint32_t modifiers, unsigned int held);
  // CKey(const CKey& key) { *this = key; }  should be obsolete

  // CKey& operator=(const CKey& key);  should be obsolete
  uint8_t GetLeftTrigger() const { return m_leftTrigger; }
  uint8_t GetRightTrigger() const { return m_rightTrigger; }
  float GetLeftThumbX() const { return m_leftThumbX; }
  float GetLeftThumbY() const { return m_leftThumbY; }
  float GetRightThumbX() const { return m_rightThumbX; }
  float GetRightThumbY() const { return m_rightThumbY; }

  bool FromKeyboard() const { return (m_buttonCode >= KEY_VKEY && m_buttonCode != KEY_INVALID); }
  bool IsAnalogButton() const { return (m_buttonCode > 261 && m_buttonCode < 270) || (m_buttonCode > 279 && m_buttonCode < 284); }
  bool IsIRRemote() const { return m_buttonCode < 256; }
  void SetFromService(bool fromService);
  bool GetFromService() const { return m_fromService; }

  uint32_t GetButtonCode() const { return m_buttonCode; }
  uint8_t GetVKey() const { return m_vkey; }
  wchar_t GetUnicode() const { return m_unicode; }
  char GetAscii() const { return m_ascii; }
  uint32_t GetModifiers() const { return m_modifiers; }
  unsigned int GetHeld() const { return m_held; }

  enum class Modifiers {
    None  = 0,
    Ctrl  = (1 << 16),
    Shift = (1 << 17),
    Alt   = (1 << 18),
    RAlt  = (1 << 19),
    Super = (1 << 20),
    Meta  = (1 << 21),
    Long  = (1 << 24)   // Key remained pressed for an elongated period.
  };

private:
  uint32_t m_buttonCode = KEY_INVALID;
  uint8_t m_vkey = 0;
  wchar_t m_unicode = 0;
  char m_ascii = 0;
  uint32_t m_modifiers = 0;
  unsigned int m_held = 0;

  uint8_t m_leftTrigger = 0;
  uint8_t m_rightTrigger = 0;
  float m_leftThumbX = 0;
  float m_leftThumbY = 0;
  float m_rightThumbX = 0;
  float m_rightThumbY = 0;
  bool m_fromService = false;
};

DEFINE_ENUM_FLAG_OPERATORS(CKey::Modifiers);

#endif
