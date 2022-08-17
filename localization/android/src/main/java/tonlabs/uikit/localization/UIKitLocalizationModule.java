package tonlabs.uikit.localization;

import android.util.Log;

import androidx.annotation.NonNull;

import java.text.ParseException;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.text.DecimalFormatSymbols;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Calendar;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.WritableNativeArray;
import com.facebook.react.module.annotations.ReactModule;

import org.jetbrains.annotations.NotNull;

@ReactModule(name = UIKitLocalizationModule.REACT_CLASS)
public class UIKitLocalizationModule extends ReactContextBaseJavaModule {
    protected static final String REACT_CLASS = "UIKitLocalization";

    UIKitLocalizationModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @NonNull
    @NotNull
    @Override
    public String getName() {
        return UIKitLocalizationModule.REACT_CLASS;
    }

    @Override
    public Map<String, Object> getConstants() {
        final Map<String, Object> localeInfo = new HashMap<>();

        try {
            DecimalFormatSymbols symbols = DecimalFormatSymbols.getInstance();
            final Map<String, Object> numbers = new HashMap<>();
            numbers.put("grouping", Character.toString(symbols.getGroupingSeparator()));
            numbers.put("thousands", Character.toString(symbols.getGroupingSeparator()));
            numbers.put("decimal", Character.toString(symbols.getDecimalSeparator()));
            numbers.put("decimalGrouping", "\u2009");
            numbers.put("decimalAlternative", new String[] {
                    "\u044E",
                    "\u0431",
                    "/",
                    "?",
                    "<",
                    ">",
                    ",",
                    "."
            });

            final Map<String, Object> dates = new HashMap<>();
            WritableNativeArray components = new WritableNativeArray();
            DateInfo dateInfo = new DateInfo();
            components.pushString(dateInfo.getComponents()[0]);
            components.pushString(dateInfo.getComponents()[1]);
            components.pushString(dateInfo.getComponents()[2]);

            dates.put("separator", dateInfo.getSeparator());
            dates.put("localePattern", dateInfo.getLocalePattern());
            dates.put("components", components);

            Calendar calendar = Calendar.getInstance();

            dates.put("dayOfWeek", calendar.getFirstDayOfWeek());

            localeInfo.put("numbers", numbers);
            localeInfo.put("dates", dates);
        } catch (Throwable err) {
            Log.e(
                    REACT_CLASS,
                    String.format(
                            "Couldn't create proper constants for UIKIt localization service with error: %s",
                            err.toString()));
        }

        return localeInfo;
    }

    private static class DateInfo {
        private String separator;
        private String localePattern;
        private String[] components;

        public DateInfo() {
            this.loadInfo();
        }

        // TODO: Need to find an easier way to get the locale date pattern,
        // and process it as it is done for iOS.
        private void loadInfo() {
            DateFormat dFormat = DateFormat.getDateInstance(DateFormat.SHORT);
            String awesomeDate = "1986/06/07";
            String localeDate = "1986/06/07";
            String localeComponents = "year/month/day";
            String separator = "/";
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy/MM/dd");
            Date date = null;

            String[] components;

            try {
                date = sdf.parse(awesomeDate);
                localeDate = dFormat.format(date);
                localeDate = localeDate.replaceAll("(1986|86)", "yyyy");
                localeDate = localeDate.replaceAll("(06|6)", "MM");
                localeDate = localeDate.replaceAll("(07|7)", "dd");

                separator = localeDate.replaceAll("(yyyy)", "");
                separator = separator.replaceAll("(MM)", "");
                separator = separator.replaceAll("(dd)", "");
                separator = String.valueOf(separator.charAt(0));

                localeComponents = localeDate.replaceAll("(yyyy)", "year");
                localeComponents = localeComponents.replaceAll("(MM)", "month");
                localeComponents = localeComponents.replaceAll("(dd)", "day");

                components = localeComponents.split("\\" + separator);

                if (components.length < 3) {
                    throw new ParseException("Can't parse locale", 0);
                }
            } catch (ParseException e) {
                this.separator = "/";
                this.localePattern = "yyyy/MM/dd";
                this.components = new String[] { "year", "month", "day" };

                return;
            }
            this.separator = separator;
            this.localePattern = localeDate;
            this.components = components;
        }

        public String getSeparator() {
            return this.separator;
        }

        public String getLocalePattern() {
            return this.localePattern;
        }

        public String[] getComponents() {
            return this.components;
        }
    }
}
