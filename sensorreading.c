#include "bme280_driver.h"
#include "esp_log.h"
#include <math.h>

#define I2C_MASTER_NUM I2C_NUM_0
#define I2C_SDA 21
#define I2C_SCL 22
#define TAG "BME280"

static esp_err_t i2c_master_write(uint8_t reg, uint8_t data) {
    i2c_cmd_handle_t cmd = i2c_cmd_link_create();
    i2c_master_start(cmd);
    i2c_master_write_byte(cmd, (BME280_ADDR << 1) | I2C_MASTER_WRITE, true);
    i2c_master_write_byte(cmd, reg, true);
    i2c_master_write_byte(cmd, data, true);
    i2c_master_stop(cmd);
    esp_err_t ret = i2c_master_cmd_begin(I2C_MASTER_NUM, cmd, 1000 / portTICK_PERIOD_MS);
    i2c_cmd_link_delete(cmd);
    return ret;
}

static uint8_t i2c_master_read_byte(uint8_t reg) {
    uint8_t data;
    i2c_cmd_handle_t cmd = i2c_cmd_link_create();
    i2c_master_start(cmd);
    i2c_master_write_byte(cmd, (BME280_ADDR << 1) | I2C_MASTER_WRITE, true);
    i2c_master_write_byte(cmd, reg, true);
    i2c_master_start(cmd);
    i2c_master_write_byte(cmd, (BME280_ADDR << 1) | I2C_MASTER_READ, true);
    i2c_master_read_byte(cmd, &data, I2C_MASTER_LAST_NACK);
    i2c_master_stop(cmd);
    i2c_master_cmd_begin(I2C_MASTER_NUM, cmd, 1000 / portTICK_PERIOD_MS);
    i2c_cmd_link_delete(cmd);
    return data;
}

esp_err_t bme280_init() {
    i2c_config_t conf = {
        .mode = I2C_MODE_MASTER,
        .sda_io_num = I2C_SDA,
        .scl_io_num = I2C_SCL,
        .sda_pullup_en = GPIO_PULLUP_ENABLE,
        .scl_pullup_en = GPIO_PULLUP_ENABLE,
        .master.clk_speed = 100000
    };
    i2c_param_config(I2C_MASTER_NUM, &conf);
    i2c_driver_install(I2C_MASTER_NUM, I2C_MODE_MASTER, 0, 0, 0);

    uint8_t id = i2c_master_read_byte(0xD0);
    if (id != 0x60) {
        ESP_LOGE(TAG, "BME280 not detected! ID: 0x%02X", id);
        return ESP_FAIL;
    }

    // Soft reset
    i2c_master_write(0xE0, 0xB6);
    vTaskDelay(100 / portTICK_PERIOD_MS);

    // Humidity oversampling
    i2c_master_write(0xF2, 0x01);
    // Pressure and temperature oversampling, mode = normal
    i2c_master_write(0xF4, 0x27);
    ESP_LOGI(TAG, "BME280 initialized successfully!");
    return ESP_OK;
}

esp_err_t bme280_read_raw(float *temperature, float *humidity, float *pressure) {
    uint8_t data[8];
    for (int i = 0; i < 8; i++)
        data[i] = i2c_master_read_byte(0xF7 + i);

    int32_t adc_p = (data[0] << 12) | (data[1] << 4) | (data[2] >> 4);
    int32_t adc_t = (data[3] << 12) | (data[4] << 4) | (data[5] >> 4);
    int32_t adc_h = (data[6] << 8) | data[7];

    *temperature = adc_t / 100.0;  // simplified demo conversion
    *pressure = adc_p / 100.0;
    *humidity = adc_h / 1024.0;
    return ESP_OK;
}
