# The Hazard Library
# Copyright (C) 2013-2016 GEM Foundation
#
# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU Affero General Public License as
# published by the Free Software Foundation, either version 3 of the
# License, or (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU Affero General Public License for more details.
#
# You should have received a copy of the GNU Affero General Public License
# along with this program.  If not, see <http://www.gnu.org/licenses/>.

from openquake.hazardlib.gsim.kale_2015 import (KaleEtAlTurkey2015,
                                                 KaleEtAlIran2015)
from openquake.hazardlib.tests.gsim.utils import BaseGSIMTestCase


class KaleEtAlTurkey2015TestCase1(BaseGSIMTestCase):
    GSIM_CLASS = KaleEtAlTurkey2015

    # Tables created from Matlab code supplied by the original authors

    def test_mean(self):
        self.check('KALE15/KALE_2015_TURKEY_MEAN.csv',
                   max_discrep_percentage=0.1)

    def test_std_intra(self):
        self.check('KALE15/KALE_2015_TURKEY_STD_INTER.csv',
                   max_discrep_percentage=0.1)

    def test_std_inter(self):
        self.check('KALE15/KALE_2015_TURKEY_STD_INTRA.csv',
                   max_discrep_percentage=0.1)

    def test_std_total(self):
        self.check('KALE15/KALE_2015_TURKEY_STD_TOTAL.csv',
                   max_discrep_percentage=0.1)


class KaleEtAlIran2015TestCase2(BaseGSIMTestCase):
    GSIM_CLASS = KaleEtAlIran2015

    # Tables created from Matlab code supplied by the original authors

    def test_mean(self):
        self.check('KALE15/KALE_2015_IRAN_MEAN.csv',
                   max_discrep_percentage=0.1)

    def test_std_intra(self):
        self.check('KALE15/KALE_2015_IRAN_STD_INTER.csv',
                   max_discrep_percentage=0.1)

    def test_std_inter(self):
        self.check('KALE15/KALE_2015_IRAN_STD_INTRA.csv',
                   max_discrep_percentage=0.1)

    def test_std_total(self):
        self.check('KALE15/KALE_2015_IRAN_STD_TOTAL.csv',
                   max_discrep_percentage=0.1)
