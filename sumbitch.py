# Version: 2.3
# Author: Miguel Martinez Lopez
# Uncomment the next line to see my email
# print("Author's email: %s"%"61706c69636163696f6e616d656469646140676d61696c2e636f6d".decode("hex"))

try:
    from Tkinter import Frame, Label
    from Tkconstants import *
    from tkFont import Font, nametofont
    from ttk import Treeview, Style
except ImportError:
    from tkinter import Frame, Label
    from tkinter.constants import *
    from tkinter.font import Font, nametofont
    from tkinter.ttk import Treeview, Style

# Python 3 compatibility
try:
  basestring
except NameError:
  basestring = str

class Row(object):
    def __init__(self, table, index):
        self._multicolumn_listbox = table
        self._index = index

    def data(self):
        return self._multicolumn_listbox.row_data(self._index)

    def delete(self):
        self._multicolumn_listbox.delete_row(self._index)

    def update(self, data):
        self._multicolumn_listbox.update_row(self._index, data)

    def select(self):
        self._multicolumn_listbox.select_row(self._index)

    def deselect(self):
        self._multicolumn_listbox.deselect_row(self._index)
    
    def __str__(self):
        return str(self.data())
        
    def __len__(self):
        return self._multicolumn_listbox.number_of_columns
    
class Column(object):
    def __init__(self, table, index):
        self._multicolumn_listbox = table
        self._index = index
    
    def data(self):
        return self._multicolumn_listbox.column_data(self._index)

    def delete(self):
        self._multicolumn_listbox.delete_column(self._index)

    def update(self, data):
        self._multicolumn_listbox.update_column(self._index, data)

    def __str__(self):
        return str(self.data())
        
    def __len__(self):
        return self._multicolumn_listbox.number_of_rows
    
class Multicolumn_Listbox(object):
    _style_index = 0

    class List_Of_Rows(object):
        def __init__(self, multicolumn_listbox):
            self._multicolumn_listbox = multicolumn_listbox

        def data(self, index):
            return self._multicolumn_listbox.row_data(index)
            
        def get(self, index):
            return Row(self._multicolumn_listbox, index)

        def insert(self, data, index=None):
            self._multicolumn_listbox.insert_row(data, index)

        def delete(self, index):
            self._multicolumn_listbox.delete_row(index)

        def update(self, index, data):
            self._multicolumn_listbox.update_row(index, data)

        def select(self, index):
            self._multicolumn_listbox.select_row(index)

        def deselect(self, index):
            self._multicolumn_listbox.deselect_row(index)

        def set_selection(self, indices):
            self._multicolumn_listbox.set_selection(indices)

        def __getitem__(self, index): 
            return self.get(index)

        def __setitem__(self, index, value): 
            return self._multicolumn_listbox.update_row(index, value)

        def __delitem__(self, index): 
            self._multicolumn_listbox.delete_row(index)

        def __len__(self): 
            return self._multicolumn_listbox.number_of_rows

    class List_Of_Columns(object):
        def __init__(self, multicolumn_listbox):
            self._multicolumn_listbox = multicolumn_listbox
        
        def data(self, index):
            return self._multicolumn_listbox.get_column(index)

        def get(self, index):
            return Column(self._multicolumn_listbox, index)

        def delete(self, index):
            self._multicolumn_listbox.delete_column(index)

        def update(self, index, data):
            self._multicolumn_listbox.update_column(index, data)

        def __getitem__(self, index): 
            return self.get(index)

        def __setitem__(self, index, value): 
            return self._multicolumn_listbox.update_column(index, value)

        def __delitem__(self, index): 
            self._multicolumn_listbox.delete_column(index)

        def __len__(self): 
            return self._multicolumn_listbox.number_of_columns

    def __init__(self, master, columns, data=None, command=None, sort=True, select_mode=None, heading_anchor = CENTER, cell_anchor=W, style=None, height=None, padding=None, adjust_heading_to_content=False, stripped_rows=None, selection_background=None, selection_foreground=None, field_background=None, heading_font= None, heading_background=None, heading_foreground=None, cell_pady=2, cell_background=None, cell_foreground=None, cell_font=None, headers=True):

        self._stripped_rows = stripped_rows

        self._columns = columns
        
        self._number_of_rows = 0
        self._number_of_columns = len(columns)
        
        self.row = self.List_Of_Rows(self)
        self.column = self.List_Of_Columns(self)
        
        s = Style()

        if style is None:
            style_name = "Multicolumn_Listbox%s.Treeview"%self._style_index
            self._style_index += 1
        else:
            style_name = style
        
        style_map = {}
        if selection_background is not None:
            style_map["background"] = [('selected', selection_background)]
            
        if selection_foreground is not None:
            style_map["foeground"] = [('selected', selection_foreground)]

        if style_map:
            s.map(style_name, **style_map)

        style_config = {}
        if cell_background is not None:
            style_config["background"] = cell_background

        if cell_foreground is not None:
            style_config["foreground"] = cell_foreground

        if cell_font is None:
            font_name = s.lookup(style_name, "font")
            cell_font = nametofont(font_name)
        else:
            if not isinstance(cell_font, Font):
                if isinstance(cell_font, basestring):
                    cell_font = nametofont(cell_font)
                else:
                    if len(font) == 1:
                        cell_font = Font(family=cell_font[0])
                    elif len(font) == 2:
                        cell_font = Font(family=cell_font[0], size=cell_font[1])
                        
                    elif len(font) == 3:
                        cell_font = Font(family=cell_font[0], size=cell_font[1], weight=cell_font[2])
                    else:
                        raise ValueError("Not possible more than 3 values for font")
        
            style_config["font"] = cell_font
        
        self._cell_font = cell_font

        self._rowheight = cell_font.metrics("linespace")+cell_pady
        style_config["rowheight"]=self._rowheight

        if field_background is not None:
            style_config["fieldbackground"] = field_background

        s.configure(style_name, **style_config)

        heading_style_config = {}
        if heading_font is not None:
            heading_style_config["font"] = heading_font
        if heading_background is not None:
            heading_style_config["background"] = heading_background
        if heading_foreground is not None:
            heading_style_config["foreground"] = heading_foreground

        heading_style_name = style_name + ".Heading"
        s.configure(heading_style_name, **heading_style_config)

        treeview_kwargs = {"style": style_name}

        if height is not None:
            treeview_kwargs["height"] = height
            
        if padding is not None:
            treeview_kwargs["padding"] = padding
            
        if headers:
            treeview_kwargs["show"] = "headings"
        else:
            treeview_kwargs["show"] = ""
        
        if select_mode is not None:
            treeview_kwargs["selectmode"] = select_mode

        self.interior = Treeview(master, columns=columns, **treeview_kwargs)
        
        if command is not None:
            self._command = command
            self.interior.bind("<<TreeviewSelect>>", self._on_select)

        for i in range(0, self._number_of_columns):

            if sort:
                self.interior.heading(i, text=columns[i], anchor=heading_anchor, command=lambda col=i: self.sort_by(col, descending=False))
            else:
                self.interior.heading(i, text=columns[i], anchor=heading_anchor)
                
            if adjust_heading_to_content:
                self.interior.column(i, width=Font().measure(columns[i]))

            self.interior.column(i, anchor=cell_anchor)
            
        if data is not None:
            for row in data:
                self.insert_row(row)

    @property
    def row_height(self):
        return self._rowheight
        
    @property
    def font(self):
        return self._cell_font

    def configure_column(self, index, width=None, minwidth=None, anchor=None, stretch=None):
        kwargs = {}
        for config_name in ("width", "anchor", "stretch", "minwidth"):
            config_value = locals()[config_name]
            if config_value is not None:
                kwargs[config_name] = config_value
            
        self.interior.column('#%s'%(index+1), **kwargs)

    def row_data(self, index):
        try:
            item_ID = self.interior.get_children()[index]
        except IndexError:
            raise ValueError("Row index out of range: %d"%index)        

        return self.item_ID_to_row_data(item_ID)

    def update_row(self, index, data):
        try:
            item_ID = self.interior.get_children()[index]
        except IndexError:
            raise ValueError("Row index out of range: %d"%index)
            
        if len(data) == len(self._columns):
            self.interior.item(item_ID, values=data)
        else:
            raise ValueError("The multicolumn listbox has only %d columns"%self._number_of_columns)

    def delete_row(self, index):
        list_of_items = self.interior.get_children()

        try:
            item_ID = list_of_items[index]
        except IndexError:
            raise ValueError("Row index out of range: %d"%index)

        self.interior.delete(item_ID)
        self._number_of_rows -= 1
        
        if self._stripped_rows:
            for i in range(index, self._number_of_rows):
                self.interior.tag_configure(list_of_items[i+1], background=self._stripped_rows[i%2])
            
    def insert_row(self, data, index=None):
        if len(data) != self._number_of_columns:
            raise ValueError("The multicolumn listbox has only %d columns"%self._number_of_columns)
        
        if index is None:
            index = self._number_of_rows-1

        item_ID = self.interior.insert('', index, values=data)        
        self.interior.item(item_ID, tags=item_ID)

        self._number_of_rows += 1        

        if self._stripped_rows:            
            list_of_items = self.interior.get_children()

            self.interior.tag_configure(item_ID, background=self._stripped_rows[index%2])

            for i in range(index+1, self._number_of_rows):
                self.interior.tag_configure(list_of_items[i], background=self._stripped_rows[i%2])

    def column_data(self, index):
        return [self.interior.set(child_ID, index) for child_ID in self.interior.get_children('')]

    def update_column(self, index, data):
        for i, item_ID in enumerate(self.interior.get_children()): 
            data_row = self.item_ID_to_row_data(item_ID)
            data_row[index] = data[i]

            self.interior.item(item_ID, values=data_row)

        return data

    def clear(self):
        # Another possibility:
        #  self.interior.delete(*self.interior.get_children())

        for row in self.interior.get_children():
            self.interior.delete(row)
            
        self._number_of_rows = 0
            
    def update(self, data):
        self.clear()

        for row in data:
            self.insert_row(row)
            
    def focus(self, index=None):
        if index is None:
            return self.interior.item(self.interior.focus())
        else:
            item = self.interior.get_children()[index]
            self.interior.focus(item)

    def state(self, state=None):
        if stateSpec is None:
            return self.interior.state()
        else:
            self.interior.state(state)

    @property
    def number_of_rows(self):
        return self._number_of_rows
        
    @property
    def number_of_columns(self):
        return self._number_of_columns
        
    def toogle_selection(self, index):
        list_of_items = self.interior.get_children()
        
        try:
            item_ID = list_of_items[index]
        except IndexError:
            raise ValueError("Row index out of range: %d"%index)

        self.interior.selection_toggle(item_ID)     

    def select_row(self, index):
        list_of_items = self.interior.get_children()
        
        try:
            item_ID = list_of_items[index]
        except IndexError:
            raise ValueError("Row index out of range: %d"%index)

        self.interior.selection_add(item_ID)

    def deselect_row(self, index):
        list_of_items = self.interior.get_children()
        
        try:
            item_ID = list_of_items[index]
        except IndexError:
            raise ValueError("Row index out of range: %d"%index)

        self.interior.selection_remove(item_ID)
        
    def deselect_all(self):
        self.interior.selection_remove(self.interior.selection())

    def set_selection(self, indices):
        list_of_items = self.interior.get_children()

        self.interior.selection_set(" ".join(list_of_items[row_index] for row_index in indices))

    @property
    def selected_rows(self):
        data = []
        for item_ID in self.interior.selection():
            data_row = self.item_ID_to_row_data(item_ID)
            data.append(data_row)
        
        return data

    @property
    def indices_of_selected_rows(self):
        list_of_indices = []
        for index, item_ID in enumerate(self.interior.get_children()):
            if item_ID in self.interior.selection():
                list_of_indices.append(index)

        return list_of_indices
        
    def delete_all_selected_rows(self):
        selected_items = self.interior.selection()
        for item_ID in selected_items:
            self.interior.delete(item_ID)
        
        number_of_deleted_rows = len(selected_items)
        self._number_of_rows -= number_of_deleted_rows

        return number_of_deleted_rows

    def _on_select(self, event):
        for item_ID in event.widget.selection():
            data_row = self.item_ID_to_row_data(item_ID)
            self._command(data_row)

    def item_ID_to_row_data(self, item_ID):
        item = self.interior.item(item_ID)
        return item["values"]
    
    @property
    def table_data(self):
        data = []

        for item_ID in self.interior.get_children():
            data_row = self.item_ID_to_row_data(item_ID)
            data.append(data_row)

        return data
    
    @table_data.setter
    def table_data(self, data):
        self.update(data)
    
    def cell_data(self, row, column):
        """Get the value of a table cell"""
        try:
            item = self.interior.get_children()[row]
        except IndexError:
            raise ValueError("Row index out of range: %d"%row)
            
        return self.interior.set(item, column)
            
    def update_cell(self, row, column, value):
        """Set the value of a table cell"""

        item_ID = self.interior.get_children()[row]
        
        data = self.item_ID_to_row_data(item_ID)
        
        data[column] = value
        self.interior.item(item_ID, values=data)
    
    def __getitem__(self, index):
        if isinstance(index, tuple):
            row, column = index
            return self.cell_data(row, column)
        else:
            raise Exception("Row and column indices are required")
        
    def __setitem__(self, index, value):
        if isinstance(index, tuple):
            row, column = index
            self.update_cell(row, column, value)
        else:
            raise Exception("Row and column indices are required")

    def bind(self, event, handler):
        self.interior.bind(event, handler)

    def sort_by(self, col, descending):
        """
        sort tree contents when a column header is clicked
        """
        # grab values to sort
        data = [(self.interior.set(child_ID, col), child_ID) for child_ID in self.interior.get_children('')]
        
        # if the data to be sorted is numeric change to float
        try:
            data = [(float(number), child_ID) for number, child_ID in data]
        except ValueError:
            pass

        # now sort the data in place
        data.sort(reverse=descending)
        for idx, item in enumerate(data):
            self.interior.move(item[1], '', idx)

        # switch the heading so that it will sort in the opposite direction
        self.interior.heading(col, command=lambda col=col: self.sort_by(col, not descending))
        
        if self._stripped_rows:
            list_of_items = self.interior.get_children('')
            for i in range(len(list_of_items)):
                self.interior.tag_configure(list_of_items[i], background=self._stripped_rows[i%2])

    def destroy(self):
        self.interior.destroy()
        
    def item_ID(self, index):
        return self.interior.get_children()[index]

if __name__ == '__main__':
    try:
        from Tkinter import Tk
        import tkMessageBox as messagebox
    except ImportError:
        from tkinter import Tk
        from tkinter import messagebox

    root = Tk()
    
    def on_select(data):
        print("called command when row is selected")
        print(data)
        print("\n")
        
    def show_info(msg):
        messagebox.showinfo("Table Data", msg)

    mc = Multicolumn_Listbox(root, ["column one","column two", "column three"], stripped_rows = ("white","#f2f2f2"), command=on_select, cell_anchor="center")
    mc.interior.pack()
    
    mc.insert_row([1,2,3])
    show_info("mc.insert_row([1,2,3])")
    
    mc.row.insert([4,5,7])
    show_info("mc.row.insert([4,5,7])")

    mc.update_row(0, [7,8,9])
    show_info("mc.update_row(0, [4,5,6])")
    
    mc.update([[1,2,3], [4,5,6]])
    show_info("mc.update([[1,2,3], [4,5,6]])")
    
    mc.select_row(0)
    show_info("mc.select_row(0)")

    print("mc.selected_rows")
    print(mc.selected_rows)
    print("\n")
    
    print("mc.table_data")
    print(mc.table_data)
    print("\n")

    print("mc.row[0]")
    print(mc.row[0])
    print("\n")
    
    print("mc.row_data(0)")
    print(mc.row_data(0))
    print("\n")
    
    print("mc.column[1]")
    print(mc.column[1])
    print("\n")
    
    print("mc[0,1]")
    print(mc[0,1])
    print("\n")

    mc.column[1] = ["item1", "item2"]

    mc.update_column(2, [8,9])
    show_info("mc.update_column(2, [8,9])")
    
    mc.clear()
    show_info("mc.clear()")
    
    mc.table_data = [[1,2,3], [4,5,6], [7,8,9], [10,11,12], [13,14,15], [16,17,18], [19,20,21]]
    show_info("mc.table_data = [[1,2,3], [4,5,6], [7,8,9], [10,11,12], [13,14,15], [16,17,18], [19,20,21]]")

    mc.delete_row(1)
    show_info("mc.delete_row(1)")
    
    row = mc.row[0].update([2,4,5])
    show_info("mc.row[0].update([2,4,5])")

    root.mainloop()
