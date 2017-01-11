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

#include "system.h"
#include "input/Key.h"
#include "input/ButtonTranslator.h"

CKey::CKey(uint32_t buttonCode, uint8_t leftTrigger, uint8_t rightTrigger, float leftThumbX, float leftThumbY, float rightThumbX, float rightThumbY, float repeat)
  : m_buttonCode(buttonCode)
  , m_leftTrigger(leftTrigger)
  , m_rightTrigger(rightTrigger)
  , m_leftThumbX(leftThumbX)
  , m_leftThumbY(leftThumbY)
  , m_rightThumbX(rightThumbX)
  , m_rightThumbY(rightThumbY)
{}

CKey::CKey(uint32_t buttonCode, unsigned int held)
  : CKey(buttonCode)
{
  m_held = held;
}

CKey::CKey(uint8_t vkey, wchar_t unicode, char ascii, uint32_t modifiers, unsigned int held)
  : m_vkey(vkey)
  , m_unicode(unicode)
  , m_ascii(ascii)
  , m_modifiers(modifiers)
  , m_held(held)
  // FIXME: This needs cleaning up - should we always use the unicode key where available?
  , m_buttonCode(vkey ? (vkey | KEY_VKEY) : KEY_UNICODE)
{
  m_buttonCode |= m_modifiers;
}


void CKey::SetFromService(bool fromService)
{
  if (fromService && (m_buttonCode & KEY_ASCII))
    m_unicode = m_buttonCode - KEY_ASCII;

  m_fromService = fromService;
}
