#pragma once
#include "driver/i2c.h"

#define BME280_ADDR 0x76  // or 0x77 depending on module

esp_err_t bme280_init();
esp_err_t bme280_read_raw(float *temperature, float *humidity, float *pressure);
