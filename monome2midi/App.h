#ifndef APP_H
#define APP_H

#include "Arduino.h"
#include "Interface.h"

class App {
    public:
        void virtual clock(bool phase);
        void virtual gridEvent(uint8_t device, uint8_t x, uint8_t y, uint8_t pressed);
        void virtual arcEvent(uint8_t device, uint8_t encoder, int8_t delta);
        void virtual noteOnEvent(uint8_t channel, uint8_t note, uint8_t velocity);
        void virtual noteOffEvent(uint8_t channel, uint8_t note);
        void virtual appOnEvent();
        void virtual appOffEvent();

        const char* appName;
        
    protected:
        App(Interface *interface, uint8_t appId);

        Interface *interface;
        uint8_t appId;
};

#endif
