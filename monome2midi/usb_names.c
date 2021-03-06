#include "usb_names.h"

// Edit these lines to modify the device name.  
// The length must match the number of characters in your custom name.

#define PRODUCT_NAME      {'e','n','i','g','m','a','m','i','d','i'}
#define PRODUCT_NAME_LEN   10
#define MANUFACTURER_NAME  {'e','n','i','g','m','a'}
#define MANUFACTURER_NAME_LEN 6


// Do not change this part.  This exact format is required by USB.

struct usb_string_descriptor_struct usb_string_product_name = {
  2 + PRODUCT_NAME_LEN * 2,
  3,
  PRODUCT_NAME
};

struct usb_string_descriptor_struct usb_string_manufacturer_name = {
  2 + MANUFACTURER_NAME_LEN * 2,
  3,
  MANUFACTURER_NAME
};
