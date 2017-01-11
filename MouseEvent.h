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

 /*!
 \ingroup actionkeys, mouse
 \brief Simple class for mouse events
 */
class CMouseEvent
{
public:
  CMouseEvent(int actionID, int state = 0, float offsetX = 0, float offsetY = 0)
  {
    m_id = actionID;
    m_state = state;
    m_offsetX = offsetX;
    m_offsetY = offsetY;
  };

  int    m_id;
  int    m_state;
  float  m_offsetX;
  float  m_offsetY;
};

#endif
