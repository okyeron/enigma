#ifndef MONOMESERIAL_H
#define MONOMESERIAL_H

#include "Arduino.h"
#include <USBHost_t36.h>

class MonomeGridEvent {
    public:
        uint8_t x;
        uint8_t y;
        uint8_t pressed;
};

class MonomeArcEvent {
    public:
        uint8_t index;
        int8_t delta;
};

class MonomeEventQueue {
    public:
        bool gridEventAvailable();
        MonomeGridEvent readGridEvent();

        bool arcEventAvailable();
        MonomeArcEvent readArcEvent();
        
    protected:
        void addGridEvent(uint8_t x, uint8_t y, uint8_t pressed);
        void addArcEvent(uint8_t index, int8_t delta);
        
    private:
        static const int MAXEVENTCOUNT = 50;
        
        MonomeGridEvent emptyGridEvent;
        MonomeGridEvent gridEvents[MAXEVENTCOUNT];
        int gridEventCount = 0;
        int gridFirstEvent = 0;

        MonomeArcEvent emptyArcEvent;
        MonomeArcEvent arcEvents[MAXEVENTCOUNT];
        int arcEventCount = 0;
        int arcFirstEvent = 0;
};

class MonomeSerial : public USBSerial, public MonomeEventQueue {
    public: 
        MonomeSerial(USBHost usbHost);
        void poll();
        void refresh();

        void setLed(uint8_t x, uint8_t y, uint8_t level);
        void clearLed(uint8_t x, uint8_t y);
        void clearAllLeds();
        void refreshGrid();
        void refreshArc();
        
    private : 
        static const int MAXLEDCOUNT = 256;
        uint8_t leds[MAXLEDCOUNT];
        bool arcDirty = false;
        bool gridDirty = false;

        void processSerial();
        MonomeSerial();
};

#endif
