// can't figure out how to use MIDI library in a class so just gonna do this

void midiNoteOn(uint8_t channel, uint8_t note, uint8_t velocity) {
    // When using MIDIx4 or MIDIx16, usbMIDI.getCable() can be used
    // to read which of the virtual MIDI cables received this message.
    
    usbMIDI.sendNoteOn(note, velocity, channel);
    MIDI.sendNoteOn(note, velocity, channel);

    /*
    Serial.print("Note On, ch=");
    Serial.print(channel, DEC);
    Serial.print(", note=");
    Serial.print(note, DEC);
    Serial.print(", velocity=");
    Serial.println(velocity, DEC);
    */

    // echo midi note-on back to midi device?
    midi01.sendNoteOn(note, velocity, channel);
    midi02.sendNoteOn(note, velocity, channel);
    midi03.sendNoteOn(note, velocity, channel);
    midi04.sendNoteOn(note, velocity, channel);
}

void midiNoteOff(uint8_t channel, uint8_t note, uint8_t velocity) {
    usbMIDI.sendNoteOff(note, 0, channel);
    MIDI.sendNoteOff(note, 0, channel);

    /*
    Serial.print("Note Off, ch=");
    Serial.print(channel, DEC);
    Serial.print(", note=");
    Serial.print(note, DEC);
    Serial.print(", velocity=");
    Serial.println(velocity, DEC);
    */

    // echo midi note-off back to midi device?
    midi01.sendNoteOff(note, 0, channel);
    midi02.sendNoteOff(note, 0, channel);
    midi03.sendNoteOff(note, 0, channel);
    midi04.sendNoteOff(note, 0, channel);
}

void myControlChange(byte channel, byte control, byte value) {
    usbMIDI.sendControlChange(control, value, channel);
    MIDI.sendControlChange(control, value, channel);

    /*
      midi01.sendControlChange(control, value, channel);
      midi02.sendControlChange(control, value, channel);
      midi03.sendControlChange(control, value, channel);
      midi04.sendControlChange(control, value, channel);
    */
    Serial.print("Control Change, ch=");
    Serial.print(channel, DEC);
    Serial.print(", control=");
    Serial.print(control, DEC);
    Serial.print(", value=");
    Serial.println(value, DEC);
}