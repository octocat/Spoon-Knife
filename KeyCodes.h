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

// Reserved 0 - 255
//  XBIRRemote.h
//  XINPUT_IR_REMOTE-*

/*
 * EventServer "gamepad" keys based on original Xbox controller
 */
// Analogue - don't change order
#define KEY_BUTTON_A                        256
#define KEY_BUTTON_B                        257
#define KEY_BUTTON_X                        258
#define KEY_BUTTON_Y                        259
#define KEY_BUTTON_BLACK                    260
#define KEY_BUTTON_WHITE                    261
#define KEY_BUTTON_LEFT_TRIGGER             262
#define KEY_BUTTON_RIGHT_TRIGGER            263

#define KEY_BUTTON_LEFT_THUMB_STICK         264
#define KEY_BUTTON_RIGHT_THUMB_STICK        265

#define KEY_BUTTON_RIGHT_THUMB_STICK_UP     266 // right thumb stick directions
#define KEY_BUTTON_RIGHT_THUMB_STICK_DOWN   267 // for defining different actions per direction
#define KEY_BUTTON_RIGHT_THUMB_STICK_LEFT   268
#define KEY_BUTTON_RIGHT_THUMB_STICK_RIGHT  269

// Digital - don't change order
#define KEY_BUTTON_DPAD_UP                  270
#define KEY_BUTTON_DPAD_DOWN                271
#define KEY_BUTTON_DPAD_LEFT                272
#define KEY_BUTTON_DPAD_RIGHT               273

#define KEY_BUTTON_START                    274
#define KEY_BUTTON_BACK                     275

#define KEY_BUTTON_LEFT_THUMB_BUTTON        276
#define KEY_BUTTON_RIGHT_THUMB_BUTTON       277

#define KEY_BUTTON_LEFT_ANALOG_TRIGGER      278
#define KEY_BUTTON_RIGHT_ANALOG_TRIGGER     279

#define KEY_BUTTON_LEFT_THUMB_STICK_UP      280 // left thumb stick directions
#define KEY_BUTTON_LEFT_THUMB_STICK_DOWN    281 // for defining different actions per direction
#define KEY_BUTTON_LEFT_THUMB_STICK_LEFT    282
#define KEY_BUTTON_LEFT_THUMB_STICK_RIGHT   283

/*
 * joystick.xml keys based on Xbox 360 controller
 */
#define KEY_JOYSTICK_BUTTON_A                        284
#define KEY_JOYSTICK_BUTTON_B                        285
#define KEY_JOYSTICK_BUTTON_X                        286
#define KEY_JOYSTICK_BUTTON_Y                        287
#define KEY_JOYSTICK_BUTTON_LEFT_SHOULDER            288
#define KEY_JOYSTICK_BUTTON_RIGHT_SHOULDER           289
#define KEY_JOYSTICK_BUTTON_LEFT_TRIGGER             290
#define KEY_JOYSTICK_BUTTON_RIGHT_TRIGGER            291
#define KEY_JOYSTICK_BUTTON_LEFT_STICK_BUTTON        292
#define KEY_JOYSTICK_BUTTON_RIGHT_STICK_BUTTON       293
#define KEY_JOYSTICK_BUTTON_RIGHT_THUMB_STICK_UP     294
#define KEY_JOYSTICK_BUTTON_RIGHT_THUMB_STICK_DOWN   295
#define KEY_JOYSTICK_BUTTON_RIGHT_THUMB_STICK_LEFT   296
#define KEY_JOYSTICK_BUTTON_RIGHT_THUMB_STICK_RIGHT  297
#define KEY_JOYSTICK_BUTTON_DPAD_UP                  298
#define KEY_JOYSTICK_BUTTON_DPAD_DOWN                299
#define KEY_JOYSTICK_BUTTON_DPAD_LEFT                300
#define KEY_JOYSTICK_BUTTON_DPAD_RIGHT               301
#define KEY_JOYSTICK_BUTTON_START                    302
#define KEY_JOYSTICK_BUTTON_BACK                     303
#define KEY_JOYSTICK_BUTTON_LEFT_THUMB_STICK_UP      304
#define KEY_JOYSTICK_BUTTON_LEFT_THUMB_STICK_DOWN    305
#define KEY_JOYSTICK_BUTTON_LEFT_THUMB_STICK_LEFT    306
#define KEY_JOYSTICK_BUTTON_LEFT_THUMB_STICK_RIGHT   307
#define KEY_JOYSTICK_BUTTON_GUIDE                    308

// 0xF000 -> 0xF200 is reserved for the keyboard; a keyboard press is either
#define KEY_VKEY            0xF000 // a virtual key/functional key e.g. cursor left
#define KEY_ASCII           0xF100 // a printable character in the range of TRUE ASCII (from 0 to 127) // FIXME make it clean and pure unicode! remove the need for KEY_ASCII
#define KEY_UNICODE         0xF200 // another printable character whose range is not included in this KEY code

// 0xE000 -> 0xEFFF is reserved for mouse actions
#define KEY_VMOUSE          0xEFFF

#define KEY_MOUSE_START            0xE000
#define KEY_MOUSE_CLICK            0xE000
#define KEY_MOUSE_RIGHTCLICK       0xE001
#define KEY_MOUSE_MIDDLECLICK      0xE002
#define KEY_MOUSE_DOUBLE_CLICK     0xE010
#define KEY_MOUSE_LONG_CLICK       0xE020
#define KEY_MOUSE_WHEEL_UP         0xE101
#define KEY_MOUSE_WHEEL_DOWN       0xE102
#define KEY_MOUSE_MOVE             0xE103
#define KEY_MOUSE_DRAG             0xE104
#define KEY_MOUSE_DRAG_START       0xE105
#define KEY_MOUSE_DRAG_END         0xE106
#define KEY_MOUSE_RDRAG            0xE107
#define KEY_MOUSE_RDRAG_START      0xE108
#define KEY_MOUSE_RDRAG_END        0xE109
#define KEY_MOUSE_NOOP             0xEFFF
#define KEY_MOUSE_END              0xEFFF

// 0xD000 -> 0xD0FF is reserved for WM_APPCOMMAND messages
#define KEY_APPCOMMAND      0xD000

// 0xF000 -> 0xF0FF is reserved for mouse actions
#define KEY_TOUCH           0xF000

#define KEY_INVALID         0xFFFF

#define REMOTE_0                      58  //!< remote keys 0-9. are used by multiple windows
#define REMOTE_1                      59  //!< for example in videoFullScreen.xml window id=2005 you can
#define REMOTE_2                      60  //!< enter time (mmss) to jump to particular point in the movie
#define REMOTE_3                      61
#define REMOTE_4                      62  //!< with spincontrols you can enter 3digit number to quickly set
#define REMOTE_5                      63  //!< spincontrol to desired value
#define REMOTE_6                      64
#define REMOTE_7                      65
#define REMOTE_8                      66
#define REMOTE_9                      67
