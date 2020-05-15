package ch.helpfuleth.instanthelpfinder.config;

import org.flowable.common.engine.impl.AbstractEngineConfiguration;
import org.flowable.common.engine.impl.EngineConfigurator;
import org.flowable.engine.ProcessEngineConfiguration;
import org.flowable.spring.SpringProcessEngineConfiguration;
import org.flowable.spring.boot.EngineConfigurationConfigurer;
import org.springframework.context.annotation.Configuration;

@Configuration
public class FlowableConfigutation {

    // IMPORTANT: the configurer is invoked before the initialization of the engine starts, but after the Spring Boot properties from the Flowable auto-configurations have been applied.
    public EngineConfigurationConfigurer<SpringProcessEngineConfiguration> customProcessEngineConfigurer() {
        return engineConfiguration -> {
            // Customize the engineConfiguration here
            engineConfiguration.setJdbcUrl("")
                .setJdbcUsername("test")
                .setJdbcPassword("")
                .setJdbcDriver("test")
                .setDatabaseSchemaUpdate(ProcessEngineConfiguration.DB_SCHEMA_UPDATE_TRUE);
        };
    }

    public static class CustomProcessEngineConfigurator implements EngineConfigurator {

        @Override
        public void beforeInit(AbstractEngineConfiguration engineConfiguration) {
            ProcessEngineConfiguration appEngineConfiguration = (ProcessEngineConfiguration) engineConfiguration;
            // Invoked before any initialisation is done to the engine
        }

        @Override
        public void configure(AbstractEngineConfiguration engineConfiguration) {
            ProcessEngineConfiguration appEngineConfiguration = (ProcessEngineConfiguration) engineConfiguration;
            // Invoked after the initialisation of the engine. Think afterInit
        }

        @Override
        public int getPriority() {
            // Priority in relation to the other configurators. See EngineConfigurationConstants
            return 0;
        }
    }
}
